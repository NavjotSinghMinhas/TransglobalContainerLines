$apiURL = "https://api.navjotsinghminhas.com"

$("#shipmentsearch").submit(function (e) {
    $('#errorshipmentresults').css('display', 'none');
    $('#shipmentresults').css('display', 'none');
    SearchShipment();
    e.preventDefault();
});

function enableDropdown() {
    $("a.button").click(function (e) {
        if ($(this).parent().parent().find('td.expandable-table__expand-row').css('display') == 'none') {
            $(this).css('display', 'none');
            $(this).parent().parent().find('td.loading').css('display', 'block');

            getData($apiURL + '/transglobal/container/' + $(this).parent().parent().find('td input.input').val())
                .then(response => {
                    var closestDateIndex = getClosestDateIndex(response);

                    var html = "";
                    for (var i = 0; i < response.length; i++) {
                        html += "<div class='table table--secondary timeline__event-table'><table class='table__wrapper'><tbody class='table__body ' data-attach-point='table-body'><tr class='timeline__event-table__row' data-status='done'><td data-th='Location' class='timeline__event-table__cell timeline__event-table__cell--heading'>" + response[i].Location + "</td></tr>";

                        if (closestDateIndex == i)
                            html += "<tr class='timeline__event-table__row' data-status='current'><td data-th='Date' class='timeline__event-table__cell timeline__event-table__cell--time'>" + getDate(response[i].Date) + "<div class='timeline__event-table__cell--time__circle icon icon-vessel'></div ></td > <td data-th='Activity' class='timeline__event-table__cell timeline__event-table__cell--desc'>";
                        else
                            html += "<tr class='timeline__event-table__row' data-status='done'><td data-th='Date' class='timeline__event-table__cell timeline__event-table__cell--time'>" + getDate(response[i].Date) + "<div class='timeline__event-table__cell--time__circle'></div ></td > <td data-th='Activity' class='timeline__event-table__cell timeline__event-table__cell--desc'>";

                        switch (response[i].Status) {
                            case 'Gate In':
                                html += response[i].Status + "<div class='timeline__event-table__cell--desc__icon icon icon-truck'></div></td></tr></tbody ></table ></div >";
                                break;
                            case 'Load':
                                html += response[i].Status + "ed on " + response[i]['Vessel Name'] + "<br>Voyage No. " + response[i]['Voyage Number'] + "<div class='timeline__event-table__cell--desc__icon icon icon-vessel'></div></td></tr></tbody ></table ></div >";
                                break;
                            case 'Discharge':
                                html += response[i].Status + "<div class='timeline__event-table__cell--desc__icon icon icon-vessel'></div></td></tr></tbody ></table ></div >";
                                break;
                            case 'Gate Out':
                                html += response[i].Status + "<div class='timeline__event-table__cell--desc__icon icon icon-truck'></div></td></tr></tbody ></table ></div >";
                                break;
                        }
                    }
                    $(this).parent().parent().find('td > div.timeline').html(html);

                    $(this).parent().parent().find('td.loading').css('display', 'none');
                    $(this).parent().parent().find('td.expandable-table__call-to-action>a.button').css('display', 'block');
                    $(this).parent().parent().find('td.expandable-table__call-to-action>a.button').addClass('open');
                    $(this).parent().parent().find('td.expandable-table__expand-row').css('display', 'block');
                });
        }
        else {
            $(this).parent().parent().find('td.expandable-table__expand-row').css('display', 'none');
            $(this).parent().parent().find('td.expandable-table__call-to-action>a.button').removeClass('open');
        }
        e.preventDefault();
    });
}

function SearchShipment() {
    if ($('#input_shipmentnumber').val() != '') {
        getData($apiURL + '/transglobal/shipment/' + $('#input_shipmentnumber').val())
            .then(response => {
                if (response != "") {
                    $('#shipmentresults').css('display', 'block');

                    $('#shipmentnumber').text($('#input_shipmentnumber').val());
                    $('#from').text(response[0].From);
                    $('#to').text(response[0].To);

                    var html = "";
                    for (var i = 0; i < response.length; i++) {
                        html += "<tr><td class='first-element' data-th='Container details'><span class='icon icon-document  icon--inline-block' aria-hidden='true'></span><span class='screen-reader-only'>document_icon</span><span class='pseudo-header--data-key'>Container details</span><span>" + response[i]['Container Number'] + "</span></td><td data-th='Container type size'><span class='icon icon-container-size  icon--inline-block' aria-hidden='true'></span><span class='screen-reader-only'>container-size_icon</span><span class='pseudo-header--data-key'>Container type size</span><span>" + response[i]['Container Type'] + "</span></td><td data-th='Loading date'><span class='icon icon-eta  icon--inline-block' aria-hidden='true'></span><span class='screen-reader-only'>eta_icon</span><span class='pseudo-header--data-key'>Loading date</span><span>" + getDate(response[i]['Loading date']) + "</span></td><td data-th='Estimated arrival date'><span class='icon icon-eta  icon--inline-block' aria-hidden='true'></span><span class='screen-reader-only'>eta_icon</span><span class='pseudo-header--data-key'>Estimated arrival date</span><span>" + getDate(response[i]['Estimated Arrival Date']) + "</span></td><td data-th='Last location'><span class='icon icon-location-pin  icon--inline-block' aria-hidden='true'></span><span class='screen-reader-only'>location-pin_icon</span><span class='pseudo-header--data-key'>Last status</span><span>" + response[i]['Last Status'] + "</span></td><td class='expandable-table__expand-row data-table__nested'><div class='timeline' id='timelineId'></div></td><td class='expandable-table__call-to-action'><a href='#' aria-disabled='false' class='button' aria-expanded='false'><span class='icon icon-chevron-down ' aria-hidden='true'></span><span class='screen-reader-only'>chevron-down_icon</span></a></td><td class='loading expandable-table__call-to-action' style='display:none; padding-right: 5px; margin-top: -5px;'><div class='spinner-border text-info' style='width: 2rem; height: 2rem;' role='status'><span class='sr-only'>Loading...</span></div></td><td><input class='input' style='display:none' value='" + response[i]['Container Id'] + "'/></td>";
                    }

                    $('#shipmentdetailsdata').html(html);
                    enableDropdown();
                }
                else {
                    $('#errorshipmentresults').css('display', 'block');
                }
            });
    }
}

function getDate(date) {
    let monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    return date.substring(0, 2) + ' ' + monthNames[date.substring(3, 5).replace(/^0+/, '') - 1] + ' ' + date.substring(6, 10);
}

function getClosestDateIndex(response) {
    var counter = -1;
    var date = new Date();

    for (var i = 0; i < response.length; i++) {
        if (response[i].Date.substring(6, 10) < date.getFullYear()) {
            counter++;
            continue;
        }
        if (response[i].Date.substring(3, 4) < (date.getMonth() + 1)) {
            counter++;
            continue;
        }

        if (response[i].Date.substring(0, 2) <= date.getDate()) {
            counter++;
            continue;
        }

        return counter;
    }

    return counter;
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

$('#file').on('change', async function () {
    var file = this.files[0];

    if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        $('#uploadStatus').html("<h1 class='font--display-1'>Only excel files (.xlsx) are allowed.</h1>");
    }
    else {
        $('#uploadStatus').html('');
        window.fileData = await toBase64(file);
    }
});

$("#comp-jie33ey5form").submit(function (e) {
    upload();
    e.preventDefault();
});

function upload() {
    if (window.fileData != undefined && $('#comp-jie33eyfinput').val() != '' && $('#comp-jie33eyuinput').val() != '') {
        var fd = new FormData();
        fd.append("file", window.fileData);
        fd.append("username", $('#comp-jie33eyfinput').val());
        fd.append("password", $('#comp-jie33eyuinput').val());
        postData($apiURL + '/transglobal/upload', fd)
            .then(response => {
                if (response.response == 'success') {
                    $('#uploadStatus').html("<h1 class='font--display-1'>Successfully uploaded.</h1>");
                    $('#file').val('');
                    window.fileData = undefined;
                }
                else if (response.response == '')
                    $('#uploadStatus').html("<h1 class='font--display-1'>Error occured, try again.</h1>");
                else
                    $('#uploadStatus').html("<h1 class='font--display-1'>" + response.response + "</h1>");
            });

        $('#uploadStatus').html("<div class='spinner-border text-success' style='width: 2rem; height: 2rem; margin: 5px 10px 0 0;' role='status'><span class='sr-only'>Loading...</span></div><h1 class='font--display-1'>Uploading</h1>");
    }
    else
        $('#uploadStatus').html("<h1 class='font--display-1'>All fields are required.</h1>");
}