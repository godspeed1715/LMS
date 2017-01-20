'use strict';

/* Directives */

app = angular.module('lms.directives', [])

app.directive('profileSummary', function($compile) {
    return {
        restrict: "EA",
        template: "<div></div>",
        link: function(scope, elem, attrs) {
            var rawProfileData = attrs.profileData;

            if (typeof(rawProfileData) === 'string') {
                var profileData = JSON.parse(rawProfileData);
            } else if (typeof(rawProfileData) === 'object') {
                var profileData = rawProfileData;
            }
            var profileSummaryView = "<div id='" + profileData._id + "''>" +
                "      <div><img class='learner-profile-picture' src='" + profileData.picture + "'/></div>" +
                "     <div class='learner-profile-fullname'>" + profileData.name + "</div>" +
                "    <div class='learner-profile-role'>" + profileData.department + "," + profileData.jobTitle + "</div>" +
                "    <div class='learner-overall-progress'>Courses Completes: " + profileData.coursesCompleted + "</div>" +
                "   <div percent-Chart chart-data='" + profileData.overallProgress + "'></div>" +
                "</div>";
            elem.find('div').append(profileSummaryView)
            $compile(elem.contents())(scope)
        }
    }
});

app.directive("percentChart", function() {
    return {
        restrict: 'EA',
        template: "<svg></svg>",
        link: function(scope, elem, attrs) {
            var percent = attrs.chartData;
            var rawSvg = elem.find('svg');
            var svg1 = d3.select(rawSvg[0])
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var width = 200,
                height = 200,
                twoPi = 2 * Math.PI,
                progress = 0,
                total = 100, // must be hard-coded if server doesn't report Content-Length
                formatPercent = d3.format(".0%");

            var svg = d3.select(rawSvg[0])
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            var arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(50)
                .outerRadius(80);

            var meter = svg.append("g")
                .attr("class", "progress-meter");

            meter.append("path")
                .attr("class", "background")
                .attr("d", arc.endAngle(twoPi));

            var foreground = meter.append("path")
                .attr("class", "foreground");

            var text = meter.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", ".35em");

            var i = d3.interpolate(progress, percent / total);

            progress = i(1);
            foreground.attr("d", arc.endAngle(twoPi * progress));
            text.text(formatPercent(progress));
        }
    }
});