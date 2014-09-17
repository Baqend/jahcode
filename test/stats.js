var libNames = [];
for (var name in libs)
    libNames.push(name);

var testbed, testbedSrc;
$(function () {
    testbed = document.getElementById("testbed");
    testbedSrc = testbed.src;
});

var stats = [], index = -1;
function test(stat, names) {
    if (stat) {
        stats.push(stat);
    } else if (index != -1) {
        return;
    }

    $('#progress').show();

    var libName = libNames[++index];
    if (libName) {
        testbed.src = testbedSrc + '?' + libName;
        testbed.onload = nextTest;
    } else {
        testbed.onload = null;
        testbed.src = testbedSrc;

        $('#progress').hide();
        showStats(names);

        index = -1;
    }
}

function nextTest() {
    var stat = [], names = [];
    var bed = this.contentWindow;

    var runTest = function () {
        var name = bed.testNames[names.length];
        if (name) {
            var time = bed.runTest(name, name.indexOf('Definition') == -1 ? 100000 : 1000);
            stat.push(time);
            names.push(name);

            var testPart = (index + names.length / bed.testNames.length) / libNames.length
            $('#progress .bar').css('width', testPart * 100 + '%');

            window.setTimeout(runTest, 100);
        } else {
            test(stat, names);
        }
    }

    setTimeout(runTest, 100);
}

function showStats(names) {
    var series = [];
    for (var i = 0; i < libNames.length; i++) {
        var data = {
            name: libs[libNames[i]].name,
            data: stats[i]
        }
        if (data.name.indexOf('jahcode') > -1) {
            //add CI color to jahCode
            data['color'] = '#fa961e';
        }
        series.unshift(data);
    }


    $('#result').show();

    $('#holder').highcharts({
        chart: {
            type: 'bar',
            backgroundColor: null
        },
        title: {
            text: 'Class Definition and Instantiation Performance'
        },
        xAxis: {
            categories: names
        },
        yAxis: {
            title: {
                text: 'Time in ms'
            }
        },
        backgroundColor: null,
        series: series
    });
}