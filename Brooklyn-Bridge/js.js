$(document).ready(function () {
    let bigBox = $('.big-box');
    bigBox.css({ display: 'none' });
    let windowWidth = $(window).width();
    let error = '';
    let wrapper = $('#wrapper');
    bigBox.width('80%');

    //On resize to change the size of the Modal
    $(window).resize(function () {
        bigBox.width('80%');
    });

    // Modal with info
    let wrapperBox = $('<div class="wrapperBox"></div>');
    bigBox.append(wrapperBox);
    function ajaxSuccess(json, planetName, xi, yi, planetId) {
        for (let i in json) {
            let allTables = json[i];
            for (let table in allTables) {
                if (table === 'Planets') {
                    let allPlanets = allTables[table];
                    let singlePlanet = allPlanets[planetName];
                    showClickedPlanetData(singlePlanet, xi, yi, planetId);
                }
            }
        }
    }

    function showClickedPlanetData(singlePlanet, xi, yi, planetId) {
        bigBox.css({ display: 'block' });
        $('#' + planetId).css({ pointerEvents: 'none' });
        //append planet info
        wrapperBox.append($('<div class="planets-info-wrapper">' +
            '<div class="planets-info">' +
            '<div class="container-fluid">' +
            '<div class="row boxRow">' +
            '<div class="col-xs-11 col-sm-11 col-md-11">' +
            '<p class="overwiev"><span>Overview: </span>' + singlePlanet['overview'] + '</p>' +
            '</div>' +
            '<div class="col-xs-1 col-sm-1 col-md-1">' +
            '<p class="close">x' +
            '</p>' +
            '</div>' +
            '</div>' +
            '<div class="row boxRow">' +
            ' <div class="col-xs-6 col-sm-6 col-md-6">' +

            ' <ul>' +
            '<li><span>Spieces: </span>' + singlePlanet['kinds'] + '</li>' +
            '<li><span>Population: </span>' + singlePlanet['population'] + '</li>' +
            '<li><span>Water: </span>' + singlePlanet['water'] + '</li>' +
            '</ul>' +

            '</div>' +
            '<div class="col-xs-6 col-sm-6 col-md-6">' +

            '<ul>' +
            '<li><span>Land: </span>' + singlePlanet['land'] + '</li>' +
            '<li><span>Seasons: </span>' + singlePlanet['seasons'] + '</li>' +
            '<li><span>Countries: </span>' + singlePlanet['countries'] + '</li>' +
            '</ul>' +

            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-12 col-sm-12 col-md-12">' +
            '<div class="slider">' +
            '<div>' +
            '<img src="images/' + planetId + '/1.jpg">' +
            '</div>' +
            '<div>' +
            '<img src="images/' + planetId + '/2.jpg">' +
            '</div>' +
            '<div>' +
            '<img src="images/' + planetId + '/3.jpg">' +
            '</div>' +
            '<div>' +
            '<img src="images/' + planetId + '/4.jpg">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>')
        );

        $('.slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1000,
            arrows: false,
        });
        //close X
        $('body').on('click', '.close', function removeInfoBubble() {
            $('#' + planetId).css({ pointerEvents: 'auto' });
            $('.planets-info-wrapper').remove();

            otherPlahets = $('.planets').find('.planet');
            otherPlahets.fadeIn(1000);
            $('#' + planetId).animate({
                left: xi,
                top: yi
            })
        });
    }

    $('.planet').click(function () {
        let otherPlahets = $('.planets').find('.planet').not(this);
        otherPlahets.fadeOut(1000);
        wrapperBox.empty();
        let planetName = $(this).attr('data-planet');
        let planetId = $(this).attr('id');

        let test = $(this).position();
        let xi = test.left;
        let yi = test.top;

        $(this).animate({
            left: xi - xi + 300,
            top: yi - yi + 138,
        }, 400);

        $.ajax({
            url: 'https://solarsystem-f7dec.firebaseio.com/.json',
            success: function (data) {
                //console.log(data);
                ajaxSuccess(data, planetName, xi, yi, planetId);
            },
            error: function () {
                wrapperBox.append('<div class="error">There was error we are sorry.</div>');
            }
        });
    });

    //---Iva Save Planet---
    function clearData() {
        $('.modal-header').empty();
        $('.modal-body').empty();
        $('.modal-footer').empty();
    }

    function renderSavePlanet(SolarSystem) {
        $('#links').on('click', '.save-planet', function (e) {
            e.preventDefault();
            clearData();
            let modalHead = $('.modal-header');
            let modalBody = $('.modal-body');

            $('<h1>').addClass('modal-title').text('Which planet do you want to save?')
                .appendTo(modalHead);

            $(`<button type="button" class="close" data-dismiss="modal">&times;</button>`)
                .appendTo(modalHead)
                .css('cursor', 'pointer');

            $('<h4>')
                .text('UASA want to send some bombs and explode 1 planet. Now you can choose which planet to save from destroinment.')
                .appendTo(modalBody);

            let form = $('<form>');
            form
                .attr('id', 'savePlanet')
                .appendTo(modalBody);

            renderInputsAndChangeResult(SolarSystem);
        });
    }

    function getRandomInt(min, max) {
        return Math.floor((Math.random() * max) + min);
    }

    function renderInputsAndChangeResult(SolarSystem) {
        for (let planetName in SolarSystem) {
            let min = 1;
            let parseMin = parseInt(min);

            let max = 100;
            let parseMax = parseInt(max);

            let votInputDiv = $('<div>').addClass('voteInput').attr('id', planetName + '2')
                .append($('<input type="radio" id="' + planetName
                    + '" name="savePlannet" value="' + planetName
                    + '"><label for="' + planetName + '"><em>' + planetName + '</em></label>'));

            $('#savePlanet')
                .append(votInputDiv);

            renderProgressBar(getRandomInt(parseMin, parseMax), votInputDiv);
            btnOnClick(planetName, votInputDiv);
        }


        $('<button id="btnSave" class="btn btn-primary">Save Planet</button>')
            .appendTo($('#savePlanet'));
    }

    function renderProgressBar(parseProgressBarWidth, votInputDiv) {
        $('<div class="progress">\n' +
            '<div class="progress-bar progress-bar-striped bg-info" aria-valuenow="' +
            parseProgressBarWidth + '%" aria-valuemin="0" aria-valuemax="100" role="progressbar" style="width: ' +
            parseProgressBarWidth + '%" >' + parseProgressBarWidth + '%</div>' + '</div>')
            .appendTo(votInputDiv);
    }

    function btnOnClick(planetName, votInputDiv) {
        $('#savePlanet').on('click', '#btnSave', function (e) {
            e.preventDefault();
            let checkedPlanet = $('input[name=savePlannet]:checked').val();

            if (checkedPlanet === planetName) {
                let progressDiv = $('#' + checkedPlanet + '2').find($('.progress'));
                let alreadyRandomVal = $('#' + checkedPlanet + '2').find($('.progress')).children().text();
                let parseRandomVal = parseInt(alreadyRandomVal);
                progressDiv.empty().hide();

                renderProgressBar(parseRandomVal + 1, votInputDiv);

                $('#btnSave').attr("disabled", true);
                $('<p>')
                    .addClass('alert alert-info').text("You successfully voted for " + checkedPlanet + "! Thank you!")
                    .appendTo($('.modal-footer'));
            }
        });
    }

    function getSavePlanetData() {
        $.ajax({
            url: 'https://solarsystem-f7dec.firebaseio.com/SolarSystem/Planets.json',
            success: renderSavePlanet,
            error: function () {
                console.log('Something went wrong.');
            }
        })
    }

    //---Iva Menu---
    function getMenuData() {
        $.ajax({
            url: 'https://solarsystem-f7dec.firebaseio.com/SolarSystem/MenuData.json',
            success: renderMenuData,
            error: function (e) {
                console.log('Error taking Menu Data');
            }
        });
    }

    function accordionData() {
        $('.accortion-title').click(function (e) {
            e.preventDefault();

            let $this = $(this);

            if ($this.next().hasClass('show')) {
                $this.next().removeClass('show');
                $this.next().slideUp(350);
            } else {
                $this.find('.infoDiv').removeClass('show');
                $this.find('.infoDiv').slideUp(350);
                $this.next().toggleClass('show');
                $this.next().slideToggle(350);
            }
        });
    }
    function renderMenuData(solarSystem){
        $('.sidebar-nav').on('click', '.menuPlanet', function (e) {
            e.preventDefault();
            clearData();
            //removeInfoBubble();
            let modalHead =  $('.modal-header');
            let modalBody =  $('.modal-body');

            let planetName = $(this).text();
            for(let index in solarSystem){
                let planetObj = solarSystem[index];
                if (planetObj['name']===planetName){
                    $('<h1>')
                        .text(planetObj['name'])
                        .appendTo(modalHead);

                    $(`<button type="button" class="close" data-dismiss="modal">&times;</button>`)
                        .appendTo(modalHead)
                        .css('cursor', 'pointer');

                    $('<h3>')
                        .text(planetObj['description'])
                        .appendTo(modalBody);

                    let historyContent = $('<p>').text(planetObj['History'])
                        .addClass('infoDiv')
                        .css('display', 'none');

                    let historyDiv = $('<div>').addClass('accortion-title').text('History');

                    let presentContent = $('<p>').text(planetObj['Present'])
                        .addClass('infoDiv')
                        .css('display', 'none');
                    let presentDiv = $('<div>').addClass('accortion-title').text('Present');

                    let accordion = $('<div>').addClass('accordion')
                        .append(historyDiv)
                        .append(historyContent)
                        .append(presentDiv)
                        .append(presentContent)
                        .appendTo(modalBody);

                    accordionData();
                }
            }
        })
    }


    //deni history link

    function renderHistory(histories) {
        $('#links').on('click', '.history', function (e) {
            e.preventDefault();
            clearData();
            $(`<button type="button" class="close" data-dismiss="modal">&times;</button>`)
                .appendTo($('.modal-header'))
                .css('cursor', 'pointer');

            for (let key in histories) {
                let history = histories[key];
                let historyDiv = $('<div class="history-content">')
                    .append('<p>' + history + '</p>');
                $('#history .modal-body').append(historyDiv);
            }

        });
    }

    function getAllHistory() {
        let requestURL = 'https://solarsystem-f7dec.firebaseio.com/SolarSystem/History.json';
        $.get(requestURL).then(renderHistory).catch((err) => console.log(err));
    }

    function getDatabaseData() {
        getSavePlanetData();
        getAllHistory();
        getMenuData();
    }

    getDatabaseData()
});
