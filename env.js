module.exports = function(fs) {

    module.readEnv = function(){
        //console.log("readConfig" , this.propertyOptions);
        return fs.readFileSync('env.json');
    };
    
    return   module;
};
