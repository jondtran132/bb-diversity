var dataset = "samples.json";

function init() {
    d3.json(dataset).then(function(data) {
        var dropDown = d3.select("#selDataset")
        for (var i=0; i<data.names.length; i++) {
            dropDown.append("option").attr("value", data.names[i]).text(data.names[i]);
        };

        
        var sampleMetaData = d3.select("#sample-metadata");
        var starter = Object.entries(data.metadata[0]);
        for (var i=0; i<starter.length; i++) {
            sampleMetaData.append("p").text(`${starter[i][0]}: ${starter[i][1]}`);
        };


        var otuID = [];
        var sampleValues = [];
        var otuLabels = [];

        for (var i=9; i>=0; i--) {
            otuID.push("OTU " + data.samples[0].otu_ids[i]);
            
            sampleValues.push(data.samples[0].sample_values[i]);
            otuLabels.push(data.samples[0].otu_labels[i]);
        };


        var hBar = [{
            x: sampleValues,
            y: otuID,
            type: "bar",
            orientation: "h",
            text: otuLabels
        }];


        var allOTU = data.samples[0].otu_ids;
        var allValues = data.samples[0].sample_values;
        var allLabels = data.samples[0].otu_labels;

        var bubbleChart = [{
            x: allOTU,
            y: allValues,
            mode: "markers",
            text: allLabels,
            marker: {size: allValues}
        }];

        var layout = {title: "Top 10 Bacteria Cultures Found"};
        Plotly.newPlot("bar",hBar, layout);
        Plotly.newPlot("bubble", bubbleChart, {title: "Bacteria Cultures Per Sample"});
    });
};

function optionChanged() {
    var current = d3.select("#selDataset").property("value");

    d3.json(dataset).then(function(data) {
        for (var i=0; i<data.metadata.length; i++) {
            if (data.metadata[i].id == current) {
                var newMData = Object.entries(data.metadata[i]);
                var newSample = Object.entries(data.samples[i]);
                break;
            };
        };
        
        var sampleMetaData = d3.select("#sample-metadata");
        sampleMetaData.html("");
        for (var i=0; i<newMData.length; i++) {
            sampleMetaData.append("p").text(`${newMData[i][0]}: ${newMData[i][1]}`);
        };

        var otuID = [];
        var sampleValues = [];
        var otuLabels = [];

        for (var i=9; i>=0; i--) {
            otuID.push("OTU " + newSample[1][1][i]);
            sampleValues.push(newSample[2][1][i]);
            otuLabels.push(newSample[3][1][i]);
        };

        var allOTU = newSample[1][1];
        var allValues = newSample[2][1];
        var allLabels = newSample[3][1];

        Plotly.restyle("bar","x", [sampleValues]);
        Plotly.restyle("bar","y", [otuID]);
        Plotly.restyle("bar","text", [otuLabels]);

        Plotly.restyle("bubble","x", [allOTU]);
        Plotly.restyle("bubble","y", [allValues]);
        Plotly.restyle("bubble","text", [allLabels]);
    });
};

init();