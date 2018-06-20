const preventDefault = cb => e => {
    e.preventDefault();
    cb();
};

export default preventDefault;