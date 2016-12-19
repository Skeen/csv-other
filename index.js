var fs = require('fs');
var Converter = require("csvtojson").Converter;

var converter = new Converter({constructResult:false});
var keep_str = process.argv[3];
var keep = keep_str.split(',');

var gen_data = function()
{
    converter.on("record_parsed", function(json)
    {
        var result = [];

        // Output the ones we asked for
        keep.forEach(function(key)
        {
            result.push(json[key]);
        });
        // Find the ones to concatenate
        var others = Object.keys(json).filter(function(e)
        {
            return this.indexOf(e) < 0;
        }, keep);
        // Concatenate them
        var others_val = others.reduce(function(acc, key)
        {
            return acc + json[key];
        }, 0);
        result.push(Math.round(others_val * 100) / 100);

        console.log(result.join(','));
    });

    fs.createReadStream(process.argv[2]).pipe(converter);
}

var gen_header = function()
{
    var header = [];
    keep.forEach(function(key)
    {
        header.push(key);
    });
    header.push('Other');
    console.log(header.join(','));
}

gen_header();
gen_data();
