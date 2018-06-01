/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var cropForm = new FormData();

var Accounting = {
    token: 'b2b35e6683f9415e927efe01c998b55c5243f0e59853443e9cdceb2f147c8237',
    lang: 'az',
    appId: 1000015,
    currModule: '',
    operationList: [],
    array: [],
    node: [],
    structureId: '',
    subModuleId: [],
    personId: 0,
    button: '',
    top: 0,
    eduLevels: [],
    universities: [],
    begin: true,
    personId:'',
            tempData: {
                form: ''
            },
    Codes: {
        FOREIGN_UNIVERSITY:86
    },
    urls: {
        Accounting: "http://localhost:8080/UnibookAccountingRest/",
        ROS: "http://192.168.1.78:8082/ROS/",
//         AdminRest: 'http://localhost:8080/AdministrationRest/',
        AdminRest: 'http://192.168.1.78:8082/AdministrationRest/',
        //HSIS: "http://192.168.1.78:8082/UnibookHsisRest/",
         HSIS: "http://localhost:8080/UnibookHsisRest/",
        REPORT: 'http://192.168.1.78:8082/ReportingRest/',
        EMS: 'http://192.168.1.78:8082/UnibookEMS/',
//        EMS: 'http://localhost:8080/UnibookEMS/',
        // REPORT: 'http://localhost:8080/ReportingRest/'
    },
    statusCodes: {
        OK: 'OK',
        UNAUTHORIZED: 'UNAUTHORIZED',
        ERROR: 'ERROR',
        INVALID_PARAMS: 'INVALID_PARAMS'
    },
    REGEX: {
        email: /\S+@\S+\.\S+/,
        number: /^\d+$/,
        decimalNumber: /^\d+(\.\d+)?$/,
        TEXT: 'text\/plain',
        PDF: 'application\/pdf',
        XLS: 'application\/vnd\.ms-excel',
        XLSX: 'application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet',
        DOC: 'application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document',
        DOCX: 'application\/msword',
        phone: /\(\+\d{3}\)-\d{2}-\d{3}-\d{2}-\d{2}/,
        IMAGE_EXPRESSION: 'image\/jpeg|image\/png',
    },
    MASK: {
        phone: '(+000)-00-000-00-00'
    },
    initToken: function (cname) {
        var name = cname + "=";

        if (document.cookie == name + null || document.cookie == "") {
            window.location.href = '/AdministrationSystem/greeting.html'
        }

        else {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    Accounting.token = c.substring(name.length, c.length);
                }
            }
        }

    },
    initLanguageCookie: function (name) {
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                Accounting.lang = c.substring(name.length, c.length).split('=')[1];
            }
        }

        if (Accounting.lang.trim().length === 0) {
            Accounting.lang = 'az';
        }
    },
    initCurrentModule: function (name) {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var currModule = c.substring(name.length, c.length).split('=')[1];
                return currModule;
            }
        }
        return "";
    },
    loadLanguagePack: function (lang) {
        $.getJSON('assets/js/i18n/' + lang + '.json', function (data) {
            $.each(data, function (i, v) {
                Accounting.dictionary[lang][i] = v;
            });
        });
    },
    i18n: function () {
        Accounting.initLanguageCookie('lang');
        var attr = '';

        $('[data-i18n]').each(function () {
            attr = $(this).attr('data-i18n');
            $(this).text(Accounting.dictionary[Accounting.lang][attr]);
            $(this).attr('placeholder', Accounting.dictionary[Accounting.lang][attr]);
        });
    },
    getCookie: function (cookie_name) {

        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results)
            return (decodeURI(results[2]));
        else
            return null;

    },
    dictionary: {
        az: {},
        en: {},
        ru: {}
    },
    Proxy: {
        
        getUniSpecialities: function (orgId, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'university/' + orgId +'/speciality?token=' + Accounting.token,
                type: 'GET',
                beforeSend: function(){
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                break;

                            case Accounting.statusCodes.OK:
                                
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                error: function(error){
                    console.log(error);
                }
            })
        },
        
        addPelcInstallment: function (id, formData, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'students/' + id + '/installments/add?token=' + Accounting.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000128"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.modal').modal('hide')

                                break;
                            case Accounting.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000128"]').removeAttr('check', 1);
                }
            })
        },
        
        updateInstallment: function (pelcId, formData, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'students/' + pelcId + '/installments/' + formData.installmentId + '/update?token=' + Accounting.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000128"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.modal').modal('hide')

                                break;
                            case Accounting.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000128"]').removeAttr('check', 1);
                }
            })
        },
        
        removeInstallment: function (pelcId, installmentId, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'students/' + pelcId + '/installments/' + installmentId + '/delete?token=' + Accounting.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000128"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.modal').modal('hide')

                                break;
                            case Accounting.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000128"]').removeAttr('check', 1);
                }
            })
        },
        
        getProfessions: function (callback) {
            $.ajax({
                url: Accounting.urls.HSIS + 'structures/tms/type/I?token=' + Accounting.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                break;

                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
            })
        },
                
        getPelcInstallment: function (pelcId, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'students/' + pelcId +'/installments?token=' + Accounting.token,
                type: 'GET',
                beforeSend: function(){
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                break;

                            case Accounting.statusCodes.OK:
                                
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                error: function(error){
                    console.log(error);
                }
            })
        },
        
        addSpecInstallment: function(id, formData, callback) {
            $.ajax({                
                url: Accounting.urls.Accounting + 'structures/' + id + '/payments/add?token=' + Accounting.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000129"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data)
                                }
                                $('body').find('.modal').modal('hide')
                                
                                break;
                                
                            case Accounting.statusCodes.ERROR:
                                alert("Error");
                                break;
                            }    
                        }
                    },
                complete: function () {
                    $('.module-block[data-id="1000129"]').removeAttr('check', 1);
                }            
            })
        },

        updateSpecInstallmen: function(specId, formData, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'structures/' + specId + '/payments/' + formData.installmentId + '/update?token=' + Accounting.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000129"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data)
                                }
                                $('body').find('.modal').modal('hide')
                                break;
                                
                            case Accounting.statusCodes.ERROR:
                                alert("Error");
                                break;
                            }
                        }
                    },
                complete: function () {
                    $('.module-block[data-id="1000129"]').removeAttr('check', 1);
                }  
            })    
        },
        
        removeSpecInstallment: function (specId, installmentId, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'structures/' + specId + '/payments/' + installmentId + '/delete?token=' + Accounting.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000129"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.modal').modal('hide')

                                break;
                            case Accounting.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000128"]').removeAttr('check', 1);
                }
            })
        },
                
        getPaymentParts: function(orgId, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'org/' + orgId + '/paymentparts?token=' + Accounting.token,
                type: 'GET',
                beforeSend: function () {
                    $('.module-block[data-id="1000130"]').attr('check', 1);
                },
                success: function (result) {
                    if(result){
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                break;
                                
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;
                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                error: function(error){
                    console.log(error);
                }
            })    
        },
        
        addPaymentParts: function(orgId, objectForm, callback) {
            $.ajax({                            
                url: Accounting.urls.Accounting + 'org/' + orgId + '/paymentparts/add?token=' + Accounting.token,
                type: 'POST',
                data: objectForm,
                beforeSend: function () {
                    $('.module-block[data-id="1000130"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data)
                                }
                                $('body').find('.modal').modal('hide')
                                
                                break;
                                
                            case Accounting.statusCodes.ERROR:
                                alert('Xəta baş verdi')
                                break;
                            }
                        }
                    },
                complete: function () {
                    $('.module-block[data-id="1000130"]').removeAttr('check', 1);
                }
            })    
        },
        
        updatePaymentParts: function(orgId, objectForm, callback) {
            $.ajax({                            
                url: Accounting.urls.Accounting + 'org/' + orgId + '/paymentparts/' + objectForm.id + '/update?token=' + Accounting.token,
                type: 'POST',
                data: objectForm,
                beforeSend: function () {
                    $('.module-block[data-id="1000130"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data)
                                }
                                $('body').find('.modal').modal('hide')
                                
                                break;
                                
                            case Accounting.statusCodes.ERROR:
                                alert('Xəta baş verdi')
                                break;
                            }
                        }
                    },
                complete: function () {
                    $('.module-block[data-id="1000130"]').removeAttr('check', 1);
                }
            })    
        },
        
        removePaymentParts: function(orgId, id, callback) {
            $.ajax({                            
                url: Accounting.urls.Accounting + 'org/' + orgId + '/paymentparts/' + id + '/delete?token=' + Accounting.token,
                type: 'POST',
                beforeSend: function () {
                    $('.module-block[data-id="1000130"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(data.data)
                                }
                                $('body').find('.modal').modal('hide')
                                
                                break;
                                
                            case Accounting.statusCodes.ERROR:
                                alert('Xəta baş verdi')
                                break;
                            }
                        }
                    },
                complete: function () {
                    $('.module-block[data-id="1000130"]').removeAttr('check', 1);
                }
            })    
        },
        
        getPaymentsBySpec: function (specId, callback) {
            $.ajax({
                url: Accounting.urls.Accounting + 'structures/' + specId +'/payments?token=' + Accounting.token,
                type: 'GET',
                beforeSend: function(){
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                break;

                            case Accounting.statusCodes.OK:
                                
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                error: function(error){
                    console.log(error);
                }
            })
        },
        
        loadApplications: function () {
            $.ajax({
                url: Accounting.urls.ROS + 'applications?token=' + Accounting.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Accounting.statusCodes.OK:
                                    Accounting.Service.parseApplications(data.data);
                                    Accounting.Service.parseApplicationsList(data.data);
                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Accounting.statusCodes.ERROR:
                                    break;

                                case Accounting.statusCodes.UNAUTHORIZED:
                                    window.location = Accounting.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadSubApplications: function (callback) {
            $.ajax({
                url: Accounting.urls.ROS + 'applications/1000014/subApplications?token=' + Accounting.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Accounting.statusCodes.OK:
                                    if(callback)
                                        callback(data);
//                                    Admin.Service.parseSubApplicationsList(data.data);
//                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Accounting.statusCodes.ERROR:
                                    break;

                                case Accounting.statusCodes.UNAUTHORIZED:
                                    window.location = Accounting.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        
        getAcademicGroupForSelect: function (params, callback) {
            $.ajax({
                url: Accounting.urls.HSIS + 'groups/select?token=' + Accounting.token + (params ? '&' + params : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                break;

                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
            })
        },
        
        getStructureListByFilter: function (id, levelId, callback) {
            $.ajax({
                url: Accounting.urls.HSIS + 'structures/allFilter?token=' + Accounting.token,
                type: 'GET',
                data: {
                    parentId: id ? id : 0,
                    levelId: levelId ? levelId : 0
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                }
            })
        },
        
        getStructureListByFilterEditionU: function (id, levelId, page, params, callback) {
            $.ajax({
                url: Accounting.urls.HSIS + 'structures/allFilter?token=' + Accounting.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                data: {
                    parentId: id ? id : 0,
                    levelId: levelId ? levelId : 0
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                }
            })
        },
        
        loadOrgTree: function (callback, container) {
            var tree = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'structures?token=' + Accounting.token,
                type: 'GET',
                global: false,
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        $('.btn.tree-modal').attr('data-check', 1);
                        NProgress.start();
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.ERROR:

                                break;

                            case Accounting.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }
                    }

                },
                complete: function () {
                    callback(tree);
                    // $('.module-block[data-id="1000009"]').removeAttr('data-check');
                    $('.btn.tree-modal').attr('data-check');
                    NProgress.done();

                }
            });
        },
        loadModules: function (callback) {
            var modules = {};
            $.ajax({
                url: Accounting.urls.ROS + 'applications/' + Accounting.appId + '/modules?token=' + Accounting.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Accounting.statusCodes.OK:
                                    modules = data;
                                    break;

                                case Accounting.statusCodes.ERROR:
                                    $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Accounting.statusCodes.UNAUTHORIZED:
                                    window.location = Accounting.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(modules);
                }
            });
        },
        loadSubModules: function (moduleId, callback) {

            $.ajax({
                url: Accounting.urls.ROS + 'applications/modules/' + moduleId + '/subModules?token=' + Accounting.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Accounting.statusCodes.OK:
                                    callback(data);
                                    break;

                                case Accounting.statusCodes.ERROR:
                                    $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Accounting.statusCodes.UNAUTHORIZED:
                                    window.location = Accounting.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        getProfile: function () {
            $.ajax({
                url: Accounting.urls.ROS + "profile?token=" + Accounting.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                try {
                                    if (data.data) {
                                        var user = data.data;
                                        $('.user-notify-content h6[data-type="name"]').text(user.person.name + ' ' + user.person.surname + ' ' + user.person.patronymic);
                                        // $('.welcome-text p span').text(user.person.name);
                                        $('.user-notify-content p[data-type="role"]').text(user.role.value[Accounting.lang]);
                                        $('.user-notify-content p[data-type="org"]').text(user.structure.name[Accounting.lang]);
                                        $('.side-title-block p').text(user.orgName.value[Accounting.lang]);
                                        $('.main-img img').attr('src', Accounting.urls.AdminRest + 'users/' + user.id + '/image?token=' + Accounting.token);
                                        $('.side-title-block img').attr('src', Accounting.urls.HSIS + 'structures/' + user.orgName.id + '/logo?token=' + Accounting.token);
                                        var img = $('.main-img img');
                                        img.on('error', function (e) {
                                            $('.main-img img').attr('src', 'assets/img/guest.png');
                                        })
                                        $('div.big-img img').attr('src', Accounting.urls.AdminRest + 'users/' + user.id + '/image?token=' + Accounting.token);
                                        $('div.big-img img').on('error', function (e) {
                                            $('div.big-img img').attr('src', 'assets/img/guest.png');
                                        });
                                        Accounting.structureId = user.structure.id;
                                    }
                                }
                                catch (err) {
                                    console.error(err);
                                }
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        loadOperations: function (moduleId, callback) {
            var operations = {};
            $.ajax({
                url: Accounting.urls.ROS + 'applications/modules/' + moduleId + '/operations?token=' + Accounting.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Accounting.statusCodes.OK:
                                    operations = data.data;
                                    Accounting.operationList = operations;
                                    break;

                                case Accounting.statusCodes.ERROR:
                                    $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Accounting.statusCodes.UNAUTHORIZED:
                                    window.location = Accounting.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(operations);
                    if ($('#buttons_div').find('ul li').length < 1) {
                        $('#buttons_div').hide();
                        console.log('empty')
                    }
                }
            });
        },
        loadOrgTreeTypes: function (callback) {
            var types;

            $.ajax({
                url: Accounting.urls.HSIS + 'structures/types?token=' + Accounting.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.OK:
                                types = data.data;
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(types);
                }
            });

        },
        loadOrgTreeDetails: function (treeId, callback) {
            var tree = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'structures/' + treeId + '?token=' + Accounting.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });

        },
        loadOrgTreeByType: function (typeId, callback, container) {
            var tree = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'structures/bytype/' + typeId + '?token=' + Accounting.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        container.attr('data-check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        loadOrgTreeByTypeAndATM: function (typeId, atmType, callback, container) {
            var tree = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'structures/bytype/' + typeId + '?uniTypeId='+ atmType +'&token=' + Accounting.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        container.attr('data-check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        loadOrgTreeByATMType: function (typeId, uniTypeId, callback, container) {
            var tree = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'structures?uniTypeId='+ uniTypeId +'&token=' + Accounting.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        container.attr('data-check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        getPersonInfoByPinCode: function (pinCode, callback) {
            var data;
            $.ajax({
                url: Accounting.urls.HSIS + 'students/getInfoByPinCode?token=' + Accounting.token + '&pinCode=' + pinCode,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                callback(result.data);
                                break;

                            case Accounting.statusCodes.OK:
                                callback(result.data);
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },
        loadStudents: function (page, queryParams, callback, before) {

            $.ajax({
                url: Accounting.urls.HSIS + 'students/chargeable?token=' + Accounting.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {                    
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                Accounting.Service.parseStudents(result.data, page);
                                $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                                $('body').find('.col-sm-4.info').fadeOut(1).css('right', '-100%');
                                if (callback)
                                    callback(result.data);
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }


                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000011"]').removeAttr('data-check');
                }
            })
        },
        
        getStructureListByParentId: function (id, callback) {
            $.ajax({
                url: Accounting.urls.HSIS + 'structures/' + id + '/childs?token=' + Accounting.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                callback(result);
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;


                        }


                    }
                }
            })
        },
        loadDictionariesByTypeId: function (typeId, parentId, callback) {
            var result = {};
            $.ajax({
                url: Accounting.urls.AdminRest + 'settings/dictionaries?typeId=' + typeId + '&parentId=' + parentId + '&token=' + Accounting.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Accounting.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Accounting.statusCodes.ERROR:
                                    $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Accounting.statusCodes.UNAUTHORIZED:

                                    window.location = Accounting.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                    callback(result);
                }

            });
        },
        loadDictionariesListByParentId: function (parentId, callback) {
            var result = {};
            $.ajax({
                url: Accounting.urls.AdminRest + 'settings/dictionaries/parentId/' + parentId + '?token=' + Accounting.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Accounting.statusCodes.OK:
                                    callback(data)
                                    break;

                                case Accounting.statusCodes.ERROR:
                                    $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Accounting.statusCodes.UNAUTHORIZED:

                                    window.location = Accounting.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        loadAdressTypes: function (parentId, callback) {
            var result = {};
            $.ajax({
                url: Accounting.urls.AdminRest + 'settings/address/parentId/' + parentId + '?token=' + Accounting.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Accounting.statusCodes.OK:
                                    callback(data.data)
                                    break;

                                case Accounting.statusCodes.ERROR:
                                    $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Accounting.statusCodes.UNAUTHORIZED:

                                    window.location = Accounting.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        getStudentListByOrgId: function (params, callback) {
            var data = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'groups/student' + '?token=' + Accounting.token + (params ? '&' + params : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                $('.notification-parent').notify(Accounting.dictionary[Accounting.lang]['error'], {position: "bottom center", style: 'red'});
                                break;

                            case Accounting.statusCodes.OK:
                                data = result.data;

                                var htmlTag = $('#possibleStudent');
                                htmlTag.html('');
                                $.each(data, function (i, d) {
                                    var e = $(document.createElement('option'));
                                    e.attr('class', 'option_class');
                                    e.attr('onclick', 'addToSelectedStudentList($(this))');
                                    e.text(d.lastName + " " + d.firstName + " " + d.middleName);
                                    e.val(d.id);
                                    htmlTag.append(e);
                                });

                                if (students !== null) {
                                    $.each(students, function (i, stud) {
                                        var obj = $('#possibleStudent option[value=\'' + stud + '\']');
                                        obj.attr('disabled', 'disabled').attr("style", "background-color:#FF5B57;border-bottom:3px solid #FF5B57;");
                                    });
                                }

                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            });
        },
        getStudentDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'students/' + id + '?token=' + Accounting.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                data = result.data;
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    callback(data);
                }
            })
        },
        loadAddressTree: function (callback) {
            var tree = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'students/addresses?token=' + Accounting.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.OK:
                                tree = result.data;
                                break;

                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'lgoin?app=' + Accounting.appId;
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            })
        },
        getStudentCommonDetails: function (callback) {
            var id = $('#main-div').attr('data-id');
            $.ajax({
                url: Accounting.urls.HSIS + 'students/' + id + '/commonDetails?token=' + Accounting.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                callback(result);
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            })
        },
        searchStudent: function (page, query, callback) {
            $.ajax({
                url: Accounting.urls.HSIS + 'students?token=' + Accounting.token + (query ? '&' + query : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.OK:
                                if (result.data) {
                                    var div = $('.space-for-footer .flex-input');
                                    if (div.html().trim().length == 0) {
                                        var html = '<button  data-i18n="load.more" data-table="students" class="btn loading-margins btn-load-more">' + Accounting.dictionary[Accounting.lang]['load.more'] + '</button>';
                                        div.html(html);
                                    }
                                }
                                Accounting.Service.parseStudents(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }

            })
        },
        getFilteredStructureList: function (parentId, typeId, addressTreeId, callback, fullInfoFlag, children) {
            var structure = {};
            $.ajax({
                url: Accounting.urls.HSIS + 'structures/filter?parentId=' + parentId + '&typeId=' + typeId + '&addressTreeId=' + addressTreeId + '&token=' + Accounting.token + '&fullInfoFlag=' + (fullInfoFlag ? fullInfoFlag : '0') + '&children=' + (children ? children : '0'),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.OK:
                                structure = result.data;
                                callback(structure);
                                break;

                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }

            });

        },
        getStudentDetailsByPinCode: function (pincode, callback) {
            $.ajax({
                url: Accounting.urls.HSIS + 'students/pincode/' + pincode + '/details?token=' + Accounting.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.OK:
                                callback(result);
                                break;

                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });

                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        getStudentByPinCode: function (pincode, callback) {
            $.ajax({
                url: Accounting.urls.HSIS + 'students/pincode/' + pincode + '?token=' + Accounting.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.OK:
                                callback(result);
                                break;

                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }

            });
        },
        changePassword: function (pass, callback) {
            $.ajax({
                url: Accounting.urls.AdminRest + 'users/changePassword?token=' + Accounting.token,
                type: 'POST',
                data: pass,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.OK:
                                callback(result);
                                break;

                            case Accounting.statusCodes.INVALID_PARAMS:
                                callback(result);
                                break;

                            case Accounting.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Accounting.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });
        },
        getEduYears: function (callback) {
            $.ajax({
                url: Accounting.urls.REPORT + 'graphicsReport/year?token=' + Accounting.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Accounting.statusCodes.ERROR:
                                $.notify(Accounting.dictionary[Accounting.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Accounting.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }

                                break;

                            case Accounting.statusCodes.UNAUTHORIZED:
                                window.location = Accounting.urls.ROS + 'unauthorized';
                                break;


                        }
                    }

                }
            });
        }
    },
    Service: {
        parseApplications: function (applications) {
            var html = '';
            
        },
        parseApplicationsList: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    if(v.id == 1000001)
                        html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Accounting.lang] + '">' + 
                                    '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Accounting.token + '">' + v.shortName[Accounting.lang] + '</a>' + 
                                '</li>';
                });
                Accounting.Proxy.loadSubApplications(function(data) {
                    if(data && data.data) {
                        $.each(data.data, function (i, v) {
                            html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Accounting.lang] + '">' + 
                                        '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Accounting.token + '">' + v.shortName[Accounting.lang] + '</a>' + 
                                    '</li>';
                        })
                    }
                    
                    $('.app-con').html(html);
                    $('.app-con a[data-id="' + Accounting.appId + '"]').parent('li').addClass('active');
                    $('[data-toggle="tooltip"]').tooltip()

                    var moduleListItems = $('body').find('.app-con li');
                    console.log(moduleListItems)
                    if (moduleListItems.length > 5) {
                        $('body').find('div.app-list, .hide-menu').addClass('less-menu')
                    } else {
                        $('body').find('div.app-list, .hide-menu').removeClass('less-menu')
                    }
                })
                
            }

        },
        parseModules: function (modules) {
            var html = '';
            if (modules.data) {
                $.each(modules.data, function (i, v) {
                    if (v.parentId == 0) {
                        html += '<li title="' + v.name[Accounting.lang] + '" data-id="' + v.id + '" class="module-block">' +
                                '<a class="icon-' + v.iconPath + '" >' + v.shortName[Accounting.lang] +
                                '</a></li>';
                    }

                });
            }

            return html;
        },
        parseOrgTree: function (tree) {
            try {
                Accounting.array = [];
                var array = [];
                if (tree.length > 0) {
                    $.each(tree, function (i, v) {

                        var obj = {
                            id: v.id.toString(),
                            dicType: v.type.id,
                            parent: (v.parent.id) == 0 ? "#" : v.parent.id.toString(),
                            text: v.name[Accounting.lang],
                            about: v.about[Accounting.lang],
                            type: v.type.value[Accounting.lang],
                            name: v.name[Accounting.lang],
                            startDate: v.startDate,
                            endDate: v.endDate,
                            shortName: v.shortName[Accounting.lang],
                            li_attr: {
                                // 'data-img': tree[i].iconPath,
                                'title': tree[i].type.value[Accounting.lang]
                                        // 'class': 'show-tooltip'
                            },
                        };


                        array.push(obj);
                        Accounting.array.push(obj);
                    });

                    $('body').find('#jstree').jstree('refresh').jstree({
                        "core": {
                            "data": array,
                            "check_callback": true,
//                            'strings': {
//                                'Loading ...': 'Please wait ...'
//                            },
                            "themes": {
                                "variant": "large",
                                "dots": false,
                                "icons": false
                            }
                        },
                        "search": {
                            "case_insensitive": true,
                            "show_only_matches": true
                        },
                        "plugins": ["wholerow", "search", "crrm"]
                    }).on('loaded.jstree', function () {
                        // $('#jstree').jstree('open_all');
                        $('.tree-preloader').remove();
                        $('.module-block[data-id=' + Accounting.currModule + ']').removeAttr('data-check');

                    })
                }
                else {
                    $('body').find('#jstree').jstree("destroy");
                }


            }
            catch (err) {
                console.error(err);
            }
        },
        parseOperations: function (operations, type, $obj, callback) {
            var html = '';
            if (operations) {
                var innerButton = $('<div class="dropdown-func op-cont">' +
                        '<div title = "Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<img src="assets/img/upd/table-dots.svg">' +
                        '</div>' + '<ul class="dropdown-menu">' +
                        '</ul>' +
                        '</div>');

                $.each(operations, function (i, v) {
                    if (v.typeId == type) {
                        if (type == '1') {
                            html += '<li><a id="operation_' + v.id + '" href="#" >' + v.name[Accounting.lang] + '</a></li>';

                        }
                        else if (type == '2') {
                            if ($obj) {
                                var statusId = $obj.status ? $obj.status.id : 0;
                                if ((v.id == 1000042 || v.id == 1000041) && statusId == 1000340) {
                                    html += '';
                                }
                                else if ((v.id == 1000028 || v.id == 1000032) && statusId == 1000340 && v.roleId != 1000020 && v.roleId != 1000075) {
                                    html += '';
                                } else {
                                    html += '<li><a  id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Accounting.lang] + '</a></li>';
                                }
                            }
                            else {
                                html += '<li><a id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Accounting.lang] + '</a></li>';
                            }
                        }
                    }
                });

                if (type == '2') {

                    innerButton.find('ul').html(html);
                    return innerButton.html();
                }

            }
            return html;
        },
        parseDictionaryForSelect: function (data) {
            var html = '<option value="0">' + Accounting.dictionary[Accounting.lang]["select"] + '</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Accounting.lang] + '</option>';
                });

            }
            return html;
        },
        commonParseTree: function (data, objectId, nodeTypeId) {
            try {
                var array = [];
                if (data.length > 0) {

                    $.each(data, function (i, v) {
                        var obj = {
                            id: v.id.toString(),
                            parent: (v.parent.id == 0) ? "#" : v.parent.id.toString(), text: v.name[Accounting.lang],
                            typeId: v.type.id
                        };
                        array.push(obj);
                        Accounting.array.push(obj);
                    });
                    $('#main-div').find('#' + objectId).on('loaded.jstree', function (e, data) {
                        $('.tree-preloader').remove();
                        $('#' + objectId).removeAttr('data-id');
                        $('#' + objectId).removeAttr('data-check');

                    })
                            .jstree({
//                                'conditionalselect' : function(node) {
//                                    if(nodeTypeId) {
//                                        return node.original.typeId == nodeTypeId ? true : false;
//                                    }
//                                    else {
//                                        return true;
//                                    }
//                                    
//                                },
                                "core": {
                                    "data": array,
                                    "check_callback": true,
                                    "themes": {
                                        "variant": "large",
                                        "dots": false,
                                        "icons": true
                                    },
                                },
                                "search": {
                                    "case_insensitive": true,
                                    "show_only_matches": true
                                },
                                "plugins": ["conditionalselect", "wholerow", "search"],
                                "themes": {"stripes": true}
                            });
                }
                else {
                    $('#main-div').find('#' + objectId).jstree("destroy");
                }
            }
            catch (err) {
                console.error(err);
            }
        },
        parseStudents: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#student_list tbody tr').length;
                } else {
                    count = 0;
                }
                var accountingProperties = data.accountingProperties;
                var ref = data.studentList ? data.studentList : data;
                if (ref.length > 0) {
                    $.each(ref, function (i, v) {

                        var actionType = (v.endActionType.id == "0") ? v.actionType.value[Accounting.lang] : v.endActionType.value[Accounting.lang];
                        html += '<tr data-rest-amount = "' + v.accountingProperties.restAmount + '" data-paid-amount = "' + v.accountingProperties.paidAmount + '" \n\
                        data-total-amount = "' + v.accountingProperties.totalAmount + '" data-image = "'+(v.imagePath ? v.imagePath : '')+'" data-edu-pay-type="' + v.eduPayType.value[Accounting.lang] + '" \n\
                        data-edu-level="' + v.eduLevel.value[Accounting.lang] + '" data-edu-type="' + v.eduType.value[Accounting.lang] + '" data-status-id="' + (v.status.id == 1000341 ? v.status.id : "") + '" \n\
                        data-pelc-id="' + v.pelcId + '" data-id="' + v.id + '" data-firstname ="' + v.firstName + '" data-lastname ="' + v.lastName + '" data-middle-name ="' + v.middleName + '" \n\
                        data-speciality="' + (v.eduLifeCycleByOrgs ? v.eduLifeCycleByOrgs[0].name[Accounting.lang] : "") + '">' +
                                '<td>' + (++count) + '</td>' +
                                '<td style="white-space: pre-line;">' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                                '<td style="white-space: pre-line;">' + (v.eduLifeCycleByOrgs ? v.eduLifeCycleByOrgs[0].name[Accounting.lang] : "") + '</td>' +
//                                '<td>' + v.eduType.value[Accounting.lang] + '</td>' +
//                                '<td>' + v.score + '</td>' +
                                '<td style="white-space: pre-line;">' + v.accountingProperties.totalAmount + '</td>' +
                                '<td style="white-space: pre-line;">' + v.accountingProperties.paidAmount + '</td>' +
                                '<td style="white-space: pre-line;">' + v.accountingProperties.restAmount + '</td>' +
                                '<td style="white-space: pre-line;">' + v.startYearName + '</td>' +
//                                '<td style="white-space: pre-line;">' + v.status.value[Accounting.lang] + '</td>' +
                                // '<td endActionTypeId = "' + v.endActionType.id + '" >' + actionType + '</td>' +
//                                '<td endActionTypeId = "' + v.endActionType.id + '" >' + v.groupName + '</td>' +
                                // '<td>' + Accounting.Service.parseOperations(Accounting.operationList, '2', v) + '</td>' +
                                '</tr>';
                    });

                    if (data.studentCount > 0) {
                        $('span[data-student-count]').html(data.studentCount);
                    }

                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="students" class="btn loading-margins btn-load-more">' + Accounting.dictionary[Accounting.lang]["load.more"] + '</button>');
                    }
                }
                else {
                    $('span[data-student-count]').html(0);
                }


                if (page) {
                    $('body').find('#student_list tbody').append(html);
                }
                else {
                    $('body').find('#student_list tbody').html(html);
                }
                if(accountingProperties){
                    $('span[data-total-payment]').html(accountingProperties.totalAmount);
                    $('span[data-payed-payment]').html(accountingProperties.paidAmount);
                }


            }

        },
        parseAbroadStudents: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#abroad_student_list tbody tr').length;
                } else {
                    count = 0;
                }

                var ref = data.studentList ? data.studentList : data;
                if (ref.length > 0) {
                    $.each(ref, function (i, v) {

                        html += '<tr data-image = "'+(v.imagePath ? v.imagePath : '')+'" data-note = "'+v.note+'" data-abroad-number="' + v.abroadNumber + '" data-pelc-id="' + v.pelcId + '" data-id="' + v.id + '" data-firstname ="' + v.firstName + '" data-lastname ="' + v.lastName + '" data-university="' + (v.eduLifeCycleByOrgs ? v.eduLifeCycleByOrgs[0].name[Accounting.lang] : "") + '">' +
                                '<td>' + (++count) + '</td>' +
                                '<td style="white-space: pre-line;">' + v.abroadNumber + '</td>' +
                                '<td style="white-space: pre-line;">' + (v.eduLifeCycleByOrgs ? v.eduLifeCycleByOrgs[0].name[Accounting.lang] : "") + '</td>' +
                                '<td style="white-space: pre-line;">' + v.lastName + ' ' + v.firstName + ' ' + v.middleName + '</td>' +
                                '<td>' + v.birthDate + '</td>' +
                                '<td>' + v.gender.value[Accounting.lang] + '</td>' +
                                '<td style="white-space: pre-line;">' + v.graduateDate + '</td>' +
                                '<td style="white-space: pre-line;">' + v.allContact + '</td>' +
                                '<td style="white-space: pre-line;">' + v.abroadStatus.value[Accounting.lang] + '</td>' +
                                '</tr>';
                    });

                    if (data.studentCount > 0) {
                        $('span[data-student-count]').html(data.studentCount);
                    }

                    if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="abroad_students" class="btn loading-margins btn-load-more">' + Accounting.dictionary[Accounting.lang]["load.more"] + '</button>');
                    }
                }
                else {
                    $('span[data-student-count]').html(0);
                }


                if (page) {
                    $('body').find('#abroad_student_list tbody').append(html);
                }
                else {
                    $('body').find('#abroad_student_list tbody').html(html);
                }


            }

        },
        operation_1000057: function () {  // student view
            $('#main-div').load('partials/student_view.html', function () {

                Accounting.Proxy.getStudentDetails(localStorage.personId, function (data) {
                    if (data) {
                        var html = '';
                                                
                        if (data.image && data.image.path) {
                            $('body .input-file-con .new-img-con').fadeIn(1)
                            $('body .input-file-con .new-img-con img').attr('src', Accounting.urls.HSIS + 'students/image/'+data.image.path+'?token=' + Accounting.token + '&size=200x200&' + Math.random());

                            $('body .input-file-con .new-img-con img').on('error', function (e) {
                                $('body .input-file-con .new-img-con img').attr('src', 'assets/img/guest.png');
                            });
                        } else {
                           $('body .input-file-con .new-img-con img').attr('src', 'assets/img/guest.png'); 
                        }

                        $('#firstname').val(data.firstName).attr('disabled', 'disabled');
                        $('#lastname').val(data.lastName).attr('disabled', 'disabled');
                        $('#middlename').val(data.middleName).attr('disabled', 'disabled');
                        $('#pincode').val(data.pinCode).attr('disabled', 'disabled');
                        $('#disability_degree').text(data.disabilityDegree.value[Accounting.lang]).attr('disabled', 'disabled').attr('data-id', data.disabilityDegree.id);





                        if (data.contacts.length > 0) {
                          setTimeout(function () {
                              Accounting.Service.parseEditStudentAddress(data);
                              $('.contact-info .panel-body').html(Accounting.Service.parseViewStudentContact(data));
                          }, 1000);
                        }
                        $('#citizenship').find('option[value="' + data.citizenship.id + '"]').attr('selected', 'selected');
                        $('#citizenship').attr('disabled', 'disabled');
                        $('#gender').find('option[value="' + data.gender.id + '"]').attr('selected', 'selected');
                        $('#gender').attr('disabled', 'disabled')
                        $('#marital_status').find('option[value="' + data.maritalStatus.id + '"]').attr('selected', 'selected');
                        $('#marital_status').attr('disabled', 'disabled')
                        $('#social_status').find('option[value="' + data.socialStatus.id + '"]').attr('selected', 'selected');
                        $('#social_status').attr('disabled', 'disabled')
                        $('#orphan_degree').find('option[value="' + data.orphanDegree.id + '"]').attr('selected', 'selected');
                        $('#orphan_degree').attr('disabled', 'disabled')
                        $('#military_status').find('option[value="' + data.militaryService.id + '"]').attr('selected', 'selected');
                        $('#military_status').attr('disabled', 'disabled')
                        $('#nationality').find('option[value="' + data.nationality.id + '"]').attr('selected', 'selected');
                        $('#nationality').attr('disabled', 'disabled');
                        $('.date-birthdate').val(data.birthDate).attr('disabled', 'disabled');
                        $('#main-div').attr('data-id', data.id);
                        $('#main-div').attr('data-pelc-id', data.pelcId);


                        var personal = 'personal';
                        var academic = 'academic';
                        var school = 'school';

                        if (data.documents.length > 0) {
                            $('.add-doc-block .panel-body').html(Accounting.Service.parseViewStudentDocument(data.documents, personal));
                        }
                        
                        if (data.pelcDocuments.length > 0) {
                            $('.activity_name #acad_doc_add').html(Accounting.Service.parseViewStudentDocument(data.pelcDocuments, academic));
                        }
                        else {
                            $('#acad_doc_add').html('<div class="blank-panel"><h3>' + Accounting.dictionary[Accounting.lang]['no_information'] + '</h3></div>');
                        }

                        $('.activity_name #school_doc_add').html(Accounting.Service.parseViewStudentDocument(data.schoolDocuments, school));

                        $('.student-relationships-div .panel-body').html(Accounting.Service.parseViewStudentRelationShip(data.relations));

                        $('.action-students .panel-body').html(Accounting.Service.parseStudentActions(data.pelcAction));
                        $('#main-div .edit-student-action').parent('li').remove();
                        $('#main-div .erase-student-action').parent('li').remove();

                        $('#action_type').find('option[value="' + data.actionType.id + '"]').attr('selected', 'selected');
                        $('#action_type').attr('disabled', 'disabled');
                        $('#edu_line').find('option[value="' + data.eduLineId.id + '"]').attr('selected', 'selected');
                        $('#edu_line').attr('disabled', 'disabled');
                        $('#edu_lang').find('option[value="' + data.eduLangId.id + '"]').attr('selected', 'selected');
                        $('#edu_lang').attr('disabled', 'disabled');
                        $('#edu_type').find('option[value="' + data.eduType.id + '"]').attr('selected', 'selected');
                        $('#edu_type').attr('disabled', 'disabled');
                        $('#edu_pay_type').find('option[value="' + data.eduPayType.id + '"]').attr('selected', 'selected');
                        $('#edu_pay_type').attr('disabled', 'disabled');
                        $('.second-info-date').val(data.actionDate).attr('disabled', 'disabled');
                        $('.student-card-number').val(data.studentCardNo).attr('disabled', 'disabled');
                        $('#edu_level').find('option[value="' + data.eduLevel.id + '"]').attr('selected', 'selected');
                        $('#edu_level').attr('disabled', 'disabled');




                        var orderType;
                        if (data.endActionType.id != 0) {
                            $('.in-action').addClass('hidden');
                            $('.out-action').removeClass('hidden');
                            $('.add-out-action').addClass('hidden');
                            $('.add-edulifecycle, #edu_org, #past_edu_doc_info').addClass('out-action-type');
                            $('#out-action-date').val(data.endActionDate);
                            Accounting.Proxy.loadDictionariesByTypeId('1000025', 1000259, function (actionType) {
                                var html = Accounting.Service.parseDictionaryForSelect(actionType);
                                $('#main-div .student-action-type').html(html);
                                $('#main-div .student-action-type').find('option[value="' + data.endActionType.id + '"]').prop('selected', true);
                                $('#main-div #student-academic-note').html(data.note);
                                Accounting.Proxy.loadDictionariesByTypeId(1000050, 0, function (reasons) {
                                    var html = Accounting.Service.parseDictionaryForSelect(reasons);
                                    $('#outReasonId').html(html);
                                    $('#outReasonId').find('option[value="' + data.reasonId + '"]').prop('selected', true);
                                    $('.out-action :input').attr('disabled', 'disabled');
                                });

                            });

                            orderType = orderType = data.endActionType.id;

                            Accounting.Proxy.getOrderDocumentsByType(orderType, Accounting.structureId, function (order) {
                                if (order) {
                                    var html = '<option value="0">' + Accounting.dictionary[Accounting.lang]["select"] + '</option>';
                                    var st = '';
                                    $.each(order, function (i, v) {
                                        st = v.startDate == null ? '' : '-' + (v.startDate).toString().slice(6, 10);
                                        html += '<option value="' + v.id + '">' + v.serial + v.number + st + '</option>';
                                    });
                                    $('#order').html(html);
                                    $('#main-div #order').find('option[value="' + data.orderId + '"]').attr('selected', 'selected').trigger('change');
                                    $('#main-div #order').attr('disabled', 'disabled');
                                }
                            });



                        }
                        else {

                            $('#student-academic-action-date').val(data.endActionDate);
                            Accounting.Proxy.loadDictionariesByTypeId('1000025', 1000259, function (actionType) {
                                var html = Accounting.Service.parseDictionaryForSelect(actionType);
                                $('#main-div .student-action-type').html(html);
                                $('#main-div .student-action-type').find('option[value="' + data.endActionType.id + '"]').prop('selected', true);
                                $('#main-div #student-academic-note').html(data.note);
                                Accounting.Proxy.loadDictionariesByTypeId(1000050, 0, function (reasons) {
                                    var html = Accounting.Service.parseDictionaryForSelect(reasons);
                                    // $('#reasonId').html(html);
                                    $('#reasonId').find('option[value="' + data.reasonId + '"]').prop('selected', true);
                                    $('.out-action :input').attr('disabled', 'disabled');
                                });

                            });
                            $('.in-action').removeClass('hidden');
                            if (data.status.id != 1000340) {
                                $('.add-out-action').addClass('hidden');
                            }
                            else {
                                $('.add-out-action').removeClass('hidden');
                            }

                            orderType = data.actionType.id;
                        }

                        Accounting.Proxy.getOrderDocumentsByType(data.actionType.id, Accounting.structureId, function (order) {
                            if (order) {
                                var html = '<option value="0">' + Accounting.dictionary[Accounting.lang]["select"] + '</option>';
                                var st = '';
                                $.each(order, function (i, v) {
                                    st = v.startDate == null ? '' : '-' + (v.startDate).toString().slice(6, 10);
                                    html += '<option value="' + v.id + '">' + v.serial + v.number + st + '</option>';
                                });
                                $('#order').html(html);
                                $('#main-div #order').find('option[value="' + data.orderId + '"]').attr('selected', 'selected').trigger('change');
                                $('#main-div #order').attr('disabled', 'disabled');
                            }
                        });

                        $.each(data.eduLifeCycleByOrgs, function (i, v) {
                            if (v.type.id == 1000057 || v.type.id == 1000604) {
                                Accounting.Proxy.getFilteredStructureList(Accounting.structureId, v.type.id, 0, function (specialities) {
                                    if (specialities) {
                                        var html = '<option value = "0">' + Accounting.dictionary[Accounting.lang]['select'] + '</option>';
                                        $.each(specialities, function (k, l) {
                                            html += '<option value="' + l.id + '">' + l.name[Accounting.lang] + '</option>'
                                        })
                                        $('#main-div #orgId').html(html);
                                    }
                                    $('#orgId').find('option[value="' + v.id + '"]').attr('selected', 'selected');
                                    $('#orgId').attr('disabled', 'disabled');
                                });

                            }
                            else if (v.type.id == 1000056) {
                                $('.edit-graduated-school').attr('data-pelc-id', v.pelcId);
                                Accounting.Proxy.getFilteredStructureList(Accounting.structureId, '1000056', v.addressTreeId, function (schools) {
                                    var html = '<option value="0">' + Accounting.dictionary[Accounting.lang]['select'] + '</option>';
                                    if (schools) {
                                        $.each(schools, function (k, j) {
                                            html += '<option value="' + j.id + '">' + j.name[Accounting.lang] + '</option>';
                                        })
                                    }
                                    ;
                                    $('#schoolId').html(html);
                                    $('#schoolId').find('option[value = "' + v.id + '"]').attr("selected", "selected");
                                    $('#schoolId').attr('disabled', 'disabled');
                                    $('#graduatedDate').val(v.actionDate).attr('disabled', 'disabled');
                                })
                            }
                            else if (v.type.id == 1002306) {
                                $('#main-div #edu_level').find('option[value="1000604"]').prop('selected', true);
                                var eduLevel = 1000604;
                                Accounting.Proxy.getFilteredStructureList(Accounting.structureId, eduLevel, 0, function (specialities) {
                                    if (specialities) {
                                        var html = '<option value = "0">' + Accounting.dictionary[Accounting.lang]['select'] + '</option>';
                                        $.each(specialities, function (i, v) {
                                            html += '<option value="' + v.id + '">' + v.name[Accounting.lang] + '</option>'
                                        });
                                        $('#main-div #orgId').html(html);
                                        $('#main-div #orgId').find('option[value="' + v.type.parentId + '"]').prop('selected', true);
                                        $('#main-div #edit_uni_action_orgId').html(html);
                                        Accounting.Proxy.getFilteredStructureList(v.type.parentId, '1002306', 0, function (subSpeciality) {
                                            if (subSpeciality) {
                                                var html = '<option value = "0">' + Accounting.dictionary[Accounting.lang]['select'] + '</option>';
                                                $.each(subSpeciality, function (i, g) {
                                                    html += '<option value="' + g.id + '">' + g.name[Accounting.lang] + '</option>'
                                                })
                                                $('#sub_speciality').html(html);
                                                $('#sub_speciality').find('option[value="' + v.id + '"]').prop('selected', true);
                                                $('.sub_speciality').removeClass('hidden');
                                                $('#sub_speciality').attr('disabled', 'disabled');
                                                $('#orgId').attr('disabled', 'disabled');
                                            }
                                            else {
                                                $('.sub_speciality').addClass('hidden');
                                            }
                                        })
                                    }
                                });

                            }
                        })

                        $('#score').val(data.score).attr('disabled', 'disabled');
                        
                        
                        var pelcId = data.pelcId;
                        Accounting.Proxy.getStudentEduPlanSubject(pelcId, function(data) {
                            if(data && data.data) {
                                var html;
                                $('body .eduplan_name').text(data.data.name)
                                $.each(data.data.allSubjects, function(i, v) {

                                    var html = '<tr data-subject-id = "'+ v.id +'" data-id = "'+v.pelcMark.id+'" data-pelc-id = "'+pelcId+'">'+
                                                '<td>'+(++i)+'</td>'+
                                                '<td>'+v.name+'</td>'+
                                                '<td>'+v.code+'</td>'+
                                                '<td><select class="form-control subject_type" disabled="disabled"></select></td>'+
                                                '<td><input name="graduatePoint" class="form-control graduate_point" disabled="disabled"></td>'+
                                        '</tr>'
                                    $('#main-div #subject_list tbody').append(html)
                                    Accounting.Proxy.loadDictionariesByTypeId('1000097', 0, function (maritalStatus) {
                                        var html = Accounting.Service.parseDictionaryForSelect(maritalStatus);
                                        $('#main-div #subject_list tbody tr[data-id = "'+v.pelcMark.id+'"] select').html(html);
                                        $('#main-div #subject_list tbody tr[data-id = "'+v.pelcMark.id+'"] select').val(v.pelcMark.graduateType.id);
                                    });
                                    $('#main-div #subject_list tbody tr[data-id = "'+v.pelcMark.id+'"] input').val(v.pelcMark.graduateMark > 0 ? v.pelcMark.graduateMark : '');

                                })
                            }
                        })
                    }


                });
            });
        },
    },
    Validation: {
        validateEmail: function (email) {
            var re = Accounting.REGEX.email;
            return re.test(email);
        },
        validateNumber: function (number) {
            var re = Accounting.REGEX.number;
            return re.test(number);
        },
        validatePhoneNumber: function (phone) {
            var re = Accounting.REGEX.phone;
            return re.test(phone);
        },
        validateDecimalNumber: function (number) {
            var re = Accounting.REGEX.decimalNumber;
            return re.test(number);
        },
        validateRequiredFields: function (requiredAttr) {
            var required = $('[' + requiredAttr + ']');

            var requiredIsEmpty = false;

            required.each(function (i, v) {
                if (v.value.length == 0 || (requiredAttr !== 'default-teaching-required' && requiredAttr !== 'default-required' && v.value == 0 && $(this).is('select'))) {
                    $(v).addClass('blank-required-field');

                    if (!requiredIsEmpty) {

                        $.notify(Accounting.dictionary[Accounting.lang]['required_fields'], {
                            type: 'warning'
                        });
                        requiredIsEmpty = true;
                    }

                    $(v).on('focusout', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });
                }
            });

            return !requiredIsEmpty;
        },
        checkFile: function (contentType, fileType) {
            var result = contentType.match(fileType);
            if (result) {
                return true;
            }
            else {

                return false;
            }
        }
    }

};

var fileTypes = {
    IMAGE_CONTENT_TYPE: '^(' + Accounting.REGEX.IMAGE_EXPRESSION + ')$',
    FILE_CONTENT_TYPE: '^(' + Accounting.REGEX.TEXT + '|' + Accounting.REGEX.PDF + '|' + Accounting.REGEX.XLS + '|' + Accounting.REGEX.XLSX + '|' + Accounting.REGEX.DOC + '|' + Accounting.REGEX.DOCX + '|' + Accounting.REGEX.IMAGE_EXPRESSION + ')$'
};


