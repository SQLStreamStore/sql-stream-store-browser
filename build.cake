#addin "nuget:?package=Cake.Compression&version=0.1.4"
#addin "nuget:?package=Cake.Json&version=1.0.2.13"
#addin "nuget:?package=SharpZipLib&version=0.86.0"

var target          = Argument("target", "Default");

var srcDirectory    = Directory("src");

var nodeVersion     = "8.5.0";
var nodeDirectory   = Directory(".node");
var nodeJs          = GetNodePath();

var yarnVersion     = "1.0.2";
var yarnDirectory   = Directory(".yarn");
var yarn            = yarnDirectory + File($"yarn-v{yarnVersion}/bin/yarn.js");

var npmDirectory    = Directory("node_modules");

Task("Clean")
    .Does(() => 
{
    CleanDirectory(npmDirectory);
});

Task("InstallNode")
    .Does(() => 
{
    CreateDirectory(nodeDirectory);

    if (DirectoryExists(nodeJs.Path.GetDirectory())) {
        Information($"node {nodeVersion} already installed.");
        return;
    }

    var nodeDist = DownloadFile(GetNodeDownloadUri());

    if (IsRunningOnWindows()) {
        try {
            ZipUncompress(nodeDist, nodeDirectory);
        } catch (System.IO.PathTooLongException ex) {
            Warning(ex.Message);
        }
    } else {
        GZipUncompress(nodeDist, nodeDirectory);
    }    
});

Task("InstallYarn")
    .IsDependentOn("InstallNode")
    .Does(() =>
{
    CreateDirectory(yarnDirectory);

    if (GetYarnPackageVersion() == yarnVersion) {
        Information($"yarn {yarnVersion} already installed.");
        return;
    }

    CleanDirectory(yarnDirectory);

    var yarnDist = DownloadFile($"https://yarnpkg.com/downloads/{yarnVersion}/yarn-v{yarnVersion}.tar.gz");

    GZipUncompress(yarnDist, yarnDirectory);
});

Task("RestorePackages")
    .IsDependentOn("InstallYarn")
    .Does(() => 
{
    RunProcess(nodeJs, new ProcessSettings {
        Arguments = yarn.Path.MakeAbsolute(Context.Environment).ToString(),
        EnvironmentVariables = new Dictionary<string, string>
        {
            {"PATH", GetPath()}
        }
    });
});

Task("Compile")
    .IsDependentOn("RestorePackages")
    .Does(() => 
{
    RunProcess(nodeJs, new ProcessSettings {
        Arguments = $"{yarn.Path.MakeAbsolute(Context.Environment)} build",
        EnvironmentVariables = new Dictionary<string, string>
        {
            {"PATH", GetPath()}
        }
    });
});

Task("Default")
    .IsDependentOn("Compile");

RunTarget(target);

void RunProcess(FilePath fileName, ProcessSettings settings) {
    using (var process = StartAndReturnProcess(fileName, settings)) {
        process.WaitForExit();

        var exitCode = process.GetExitCode();

        if (exitCode != 0) {
            throw new Exception($"Process {fileName} {settings?.Arguments?.RenderSafe()} exited with code {exitCode}.");
        }
    }
}

string GetYarnPackageVersion() {
    var yarnPackagePath = yarnDirectory + File($"yarn-v{yarnVersion}/package.json");

    if (!FileExists(yarnPackagePath)) {
        return null;
    }

    var yarnPackage = ParseJsonFromFile(yarnPackagePath);

    return (string)yarnPackage["version"];
}

Uri GetNodeDownloadUri() => new Uri($"https://nodejs.org/dist/v{nodeVersion}/node-v{nodeVersion}-{(IsRunningOnWindows() ? "win-x64.zip" : "linux-x64.tar.xz")}");

ConvertableFilePath GetNodePath() 
    => nodeDirectory + (IsRunningOnWindows() 
        ? File($"node-v{nodeVersion}-win-x64/node.exe") 
        : File($"node-v{nodeVersion}-linux-x64/bin/node"));


string GetPath() => $"{EnvironmentVariable("Path")};{nodeJs.Path.GetDirectory().MakeAbsolute(Context.Environment)}";