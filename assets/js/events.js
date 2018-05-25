/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    var chosenLang;

    if (document.cookie.indexOf('lang') == -1) {
        chosenLang = Accounting.lang;
    }

    else {
        chosenLang = Accounting.getCookie('lang');
    }



    $('.language-buttons a').each(function () {
        if ($(this).attr('id') == chosenLang) {
            $(this).parent('li').prependTo($('.language-buttons ul'));

        }
    });

    $('body').on('click', '.hide-menu', function () {
        $('.app-list').stop().slideToggle();
    });

    $('.main-content').on('click', '.language-buttons a', function (e) {
        try {
            e.preventDefault();
            var lang = $(this).attr('id');

            if (lang != 'en' && lang != 'ru') {
                lang = 'az';
            }

            $('.language-buttons a').each(function () {
                $(this).removeAttr('data-chosen');
            });

            document.cookie = "lang=" + lang;
            window.location.reload();
        }
        catch (err) {
            console.error(err);
        }

    });

    if (Accounting.token == '0') {
        Accounting.initToken('tk');
    }


    Accounting.loadLanguagePack('az');
    Accounting.loadLanguagePack('en');
    Accounting.loadLanguagePack('ru');

    setTimeout(function () {
        Accounting.i18n();
        $.fn.datepicker.defaults.language = Accounting.lang;
        $.extend(jconfirm.pluginDefaults, {
            confirmButton: Accounting.dictionary[Accounting.lang]['ok'],
            cancelButton: Accounting.dictionary[Accounting.lang]['close'],
            title: Accounting.dictionary[Accounting.lang]['warning']
        });
    }, 1000)



    $('#logoutForm').attr("action", Accounting.urls.ROS + "logout");
    $('#logoutForm input[name="token"]').val(Accounting.token);

    Accounting.Proxy.getProfile();

    Accounting.Proxy.loadApplications();

    Accounting.Proxy.loadModules(function (modules) {
        $('ul.module .mod-con').prepend(Accounting.Service.parseModules(modules));
        $('.module-list').html(Accounting.Service.parseModules(modules));
        var currModule = Accounting.initCurrentModule('currModule');
        if (localStorage.button != undefined) {
            Accounting.Service[localStorage.button]();
            localStorage.removeItem('button');

        }
        else {
            if (currModule != "") {
                Accounting.currModule = currModule;
                var module = $('ul.module-list').find('.module-block[data-id="' + Accounting.currModule + '"] a');

                if (module.length) {
                    module.click();
                } else {
                    $('ul.module-list').find('.module-block a').eq(0).click();
                }
            }
            else {
                $('ul.module-list').find('.module-block a').eq(0).click();
            }
        }


    });



    $('ul.module-list').on('click', '.module-block a', function (e) {
        NProgress.done();
        NProgress.remove();
        var obj = $(this).parents('li');
        var title = obj.attr('title');
        var id = obj.attr('data-id');
        // $('.module-list').find('.sub-module-con').fadeOut(1);
        $('ul.module-list').find('li').removeClass('active');
        // $(this).parents('li').find('.sub-module-con').fadeIn();
        // $('.module-list').find('.sub-module-con').remove();
        $(this).parents('li').addClass('active');
        try {

            if (obj.attr('data-check') !== '1') {
                NProgress.start();
                Accounting.currModule = obj.attr('data-id');
                document.cookie = "currModule=" + Accounting.currModule;


                $('.main-content-upd').load('partials/module_' + Accounting.currModule + '.html?' + Math.random(), function () {
                    $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');
                    history.pushState({page: id}, null, '#' + title);
                    $('ul.module-list').find('li').removeAttr('data-check');
                    obj.attr('data-check', 1);

                });
            } else {
                return false
            }



            var moduleName = $(this).find('span').html();
            var html = '<li>' +
                    '<span style="color:white;">' + moduleName + '</span>' +
                    '</li>';
            $('ul.breadcrumb').html(html);
            // $('ul .sub_modules').remove();
            Accounting.tempData.form = '';
            $('#main-div').removeAttr('data-citizenship');

        }
        catch (err) {
            console.error(err);
        }
    });


    $('body').on('click', '#jstree .jstree-anchor', function (e) {
        try {
            var div = $(this).parent().closest('div').attr('id');
            $('.main-content-upd #buttons_div').attr('data-id', $(this).parent().attr('id'));
            var node = $("#" + div).jstree('get_selected', true);
            console.log(node);
            $('.main-content-upd #buttons_div').attr('parent-node', node[0].parent);
            var nodeId = node[0].id;
            Accounting.node = node;
            var about = '';
            var dicType;
            var name;
            var type;
            var shortName;
            var startDate;
            var endDate;
            Accounting.tempData.org = $(this).parents('li').attr('id');

            $.each(Accounting.array, function (i, v) {
                if (Accounting.tempData.org == v.id) {
                    console.log(v.type);
                    about = v.about;
                    dicType = v.dicType;
                    name = v.name;
                    type = v.type;
                    shortName = v.shortName;
                    startDate = v.startDate;
                    endDate = v.endDate;
                }
            });

            $('.main-row').find('.div-info').html(about);
            $('dd[name]').html(name);
            $('dd[short-name]').html(shortName);
            $('dd[type]').html(type);
            $('dd[start-date]').html(startDate);
            $('dd[closed-date]').html(endDate);
            $('.main-content-upd #buttons_div').attr('data-dicType-id', dicType);
            if (div == "jstree") {
                Accounting.Proxy.getOrgAdministrativeData(nodeId, function (data) {
                    if (data) {
                        var html = '<dl class="dl-horizontal">' +
                                '<dt><span data-i18n="add_date">Əlavə edilmə tarixi</span>:</dt>' +
                                '<dd add-date="">' + data.createDate + '</dd>' +
                                '<dt><span data-i18n="created_by">Əlavə edən</span>:</dt>' +
                                '<dd created-by="">' + data.createdBy + '</dd>' +
                                '<dt><span data-i18n="updated_date">Yenilənmə tarixi</span>:</dt>' +
                                (data.lastUpdate != null ? '<dd update-date="">' + data.lastUpdate + '</dd>' +
                                        '<dt><span data-i18n="updated_by">Yeniləyən</span>:</dt>' +
                                        '<dd updated-by="">' + data.updatedBy + '</dd>' : '') +
                                '</dl>';
                        $('#priviledged').html(html);
                    }

                })
            }
            $('body').find('.tree-div-9').removeClass('col-sm-12').addClass('col-sm-8');
            $('body').find('.tree-div-3').fadeIn();

        }

        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#orgType a', function (e) {
        try {
            var name = $(this).html();
            $('body').find('#orgTypeName').html(name);
            var typeId = $(this).attr('data-id');
            var atmType = $('#atm_type').val();
            $('#main-div #orgType').attr('data-type', typeId);
            if (typeId == "0") {
                $('.module-block[data-id="' + Accounting.currModule + '"] a').click();
            }
            else {
                Accounting.Proxy.loadOrgTreeByTypeAndATM(typeId, atmType, function (tree) {
                    $('body').find('#jstree').jstree('destroy').empty();
                    Accounting.Service.parseOrgTree(tree);
                    var structureId = $('#main-div #tree_list_child_table').attr("data-structure-id");
                    if (structureId) {
                        Accounting.Proxy.getFilteredStructureList(structureId, typeId, 0, function (data) {
                            var html = '';
                            $.each(data, function (i, v) {
                                html += '<tr data-id= "' + v.id + '">' +
                                        '<td>' + (++i) + '</td>' +
                                        '<td>' + (v.parent.name ? v.parent.name[Accounting.lang] + ' / ' + v.name[Accounting.lang] : v.name[Accounting.lang]) + '</td>' +
                                        '<td>' + v.type.value[Accounting.lang] + '</td>' +
                                        '<td>' + (v.code ? v.code : '-') + '</td>' +
                                        '</tr>';
                            });

                            $('#main-div  #tree_list_child_table tbody').html(html);
                        }, 0, 0);
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
        }
    });
    $('body').on('click', '#orgBack', function () {
        $('ul.module').find('.module-item[data-id="' + Accounting.currModule + '"]').click();
    });

    $('body').on('dblclick', '#student_list tbody tr, #foreign_student_list tbody tr', function (e) {
        try {

            var id = $(this).attr('data-id');
            var status = $(this).attr('data-status');
            if (status == 1000341) {
                $('#main-div .student-operation-div').remove();
            }
            if (localStorage.button == undefined) {
                localStorage.setItem('button', 'operation_1000057');
                localStorage.setItem('personId', id)
            }
            window.open(window.location.href, '_blank');


        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '.panel-close', function () {
        $('body').find('.col-sm-6.info').fadeOut(1).css('right', '-100%');
        $('body').find('.col-sm-6.data').removeClass('col-sm-6').addClass('col-sm-12');
    });
    $(document).on('click', '.dropdown-menu a.erase', function (e) {
        try {
            var obj = $(this);
            e.preventDefault();
            var parent = obj.parent().closest('.panel-body');
            $.confirm({
                title: Accounting.dictionary[Accounting.lang]['warning'],
                content: Accounting.dictionary[Accounting.lang]['delete_info'],
                confirm: function () {
                    obj.parents('.for-align').remove();
                    if (parent.children('.for-align').length == 0) {
                        parent.append('<div class="blank-panel"><h3>' + Accounting.dictionary[Accounting.lang]['no_information'] + '</h3></div>');
                    }
                },
                theme: 'black'
            });

        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#operation_1000029, #operation_1001347', function () {
        try {

            var id = $('body').attr('data-pelc-id');
            if (!id) {
                $.notify(Accounting.dictionary[Accounting.lang]['select_info_to_delete'], {
                    type: 'warning'
                });
                return false;
            }


            $.confirm({
                title: Accounting.dictionary[Accounting.lang]['warning'],
                content: Accounting.dictionary[Accounting.lang]['delete_info'],
                confirm: function () {
                    Accounting.Proxy.removeStudent(id, function () {
                        $('.module-block[data-id="' + Accounting.currModule + '"] a').click();
                    });
                },
                theme: 'black'
            });
        }
        catch (err) {
            console.error(err);
        }
    });
    $('body').on('click', '.student-gender li', function () {
        try {
            var id = $(this).attr('data-id');
            var genderName = $(this).find('a').text();
            if (id != 0) {
                $('.main-content-upd .student-search-form input[name="genderId"]').val(id);
                $('.main-content-upd .student-search-form input[name="genderName"]').val(genderName);
            }
            else {
                $('.main-content-upd .student-search-form input[name="genderId"]').val('');
                $('.main-content-upd .student-search-form input[name="genderId"]').val('');
            }
            $('.btn-load-more').removeAttr('data-page');
            var params = $('.main-content-upd .student-search-form').serialize();
            Accounting.Proxy.loadStudents('', params + '&subModuleId=' + Accounting.subModuleId);
        }
        catch (err) {
            console.error(err)
        }
    });

    $('body').on('click', '.student-status li', function () {
        try {
            var id = $(this).attr('data-id');
            var statusName = $(this).find('a').text();
            if (id != 0) {
                $('.main-content-upd .student-search-form input[name="statusId"]').val(id);
                $('.main-content-upd .student-search-form input[name="status"]').val(id);
                $('.main-content-upd .student-search-form input[name="statusName"]').val(statusName);

            }
            else {
                $('.main-content-upd .student-search-form input[name="statusId"]').val('');
                $('.main-content-upd .student-search-form input[name="status"]').val('');
                $('.main-content-upd .student-search-form input[name="statusName"]').val('');
            }
            $('.btn-load-more').removeAttr('data-page');
            var params = $('.main-content-upd .student-search-form').serialize();
            Accounting.Proxy.loadStudents('', params + '&subModuleId=' + Accounting.subModuleId);

        }
        catch (err) {
            console.error(err)
        }

    });

    $('body').on('click', '.student-sub-action-type li', function () {
        try {
            var id = $(this).attr('data-id');
            var actionName = $(this).find('a').text();
            if (id != 0) {
                $('.main-content-upd .student-search-form input[name="actionTypeId"]').val(id);
                $('.main-content-upd .student-search-form input[name="actionName"]').val(actionName);
                if (id == 1000260) {
                    $('#edu_start_year').removeClass('hidden');
                }
                else {
                    $('#edu_start_year').addClass('hidden');
                }

            }
            else {
                $('.main-content-upd .student-search-form input[name="actionTypeId"]').val('');
                $('.main-content-upd .student-search-form input[name="actionName"]').val('');
            }
            $('.btn-load-more').removeAttr('data-page');
            var params = $('.main-content-upd .student-search-form').serialize();
            Accounting.Proxy.loadStudents('', params + '&subModuleId=' + Accounting.subModuleId);

        }
        catch (err) {
            console.error(err)
        }

    });

    $('#main-div').on('click', '.student-gender a, .student-citizenship a, .student-status a , .student-action-type a, .student-sub-action-type a, .edu_type a, .citizenship a', function (e) {
        var text = $(this).text();
        $(this).parents('.btn-group').find('button span').text(text);
    });
   
    $('body').on('click', '#edu_type a, #student_status a, #citizenship a, #student_action_type a, #student_sub_action_type a', function (e) {
        var text = $(this).text();
        $(this).parents('.btn-group').find('button span').text(text);
    });

    $('body').on('click', '.university-list-filter a, .faculty-list-filter a, .speciality-list-filter a, .edu-level-list-filter a, .group_type a', function (e) {
        var text = $(this).text();
        $(this).parents('.btn-group').find('button span').text(text);
    });
    
        $('body').on('click', '.filter-res', function () {
        $(".module_1000011").stop().slideToggle(400)
        
        });
        
    $('.main-content-upd').on('keypress', '#student_search', function (e) {
        try {

            if (e.keyCode == 13) {
                var keyword = $('#student_search').val();

                if (keyword.trim().length > 2) {
                    $('.btn-load-more').removeAttr('data-page');
                    $('.student-search-form input[name="keyword"]').val(keyword);
                    var queryparams = $('.main-content-upd .student-search-form').serialize();
                    Accounting.Proxy.loadStudents('', queryparams + '&subModuleId=' + Accounting.subModuleId);
                }
                else if (keyword.trim().length == 0) {
                    $('.btn-load-more').removeAttr('data-page');
                    $('.student-search-form input[name="keyword"]').val('');
                    var params = $('.main-content-upd .student-search-form').serialize();
                    Accounting.Proxy.loadStudents('', params + '&subModuleId=' + Accounting.subModuleId);
                }
            }

        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '.btn-load-more', function (e) {
        try {
            var typeTable = $(this).attr('data-table');
            var $btn = $(this);
            var type = $btn.attr('data-page');
            var page = parseInt(type ? type : '2');
            var studKeyword = $('#student_search').val();
            var groupKeyword = $('#group_search').val();
            var studQueryparams = $('.main-content-upd .student-search-form').serialize()
            
            var count = $('#main-div span[data-student-count]').text();

            $btn.prop('disabled', true);
            if (typeTable == 'students') {
                if (Accounting.tempData.form != "") {
                    var advancedSearchForm = Accounting.tempData.form;
                    Accounting.Proxy.loadStudents(page, advancedSearchForm ? advancedSearchForm : studQueryparams, function (data) {
                        $btn.attr('data-page', parseInt(page) + 1);
                        $btn.prop('disabled', false);

                        if (!data.studentList || data.studentList.length == 0) {
                            $('#main-div span[data-student-count]').text(count);
                            $btn.remove();
                        }
                    });
                } else {
                    Accounting.Proxy.loadStudents(page, studQueryparams, function (data) {
                        $btn.attr('data-page', parseInt(page) + 1);
                        $btn.prop('disabled', false);
                        var ref = typeof data.studentList !== 'undefined' ? data.studentList : data;
                        if (!ref || ref.length == 0) {
                            $('#main-div span[data-student-count]').text(count);
                            $btn.remove();
                        }
                    });
                }
            }
            else if (typeTable == 'professions'){
                Accounting.Proxy.getStructureListByFilterEditionU(0, 0, page, function(data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    var ref = typeof data.specialityList !== 'undefined' ? data.specialityList : data;
                    if (!ref || ref.length == 0) {
                        $('#main-div span[data-student-count]').text(count);
                        $btn.remove();
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.btn-student-advanced-search', function (e) {
        try {
      
            $('.advanced-upd .search-scroll').load('partials/student_advanced_search.html', function () {
                $('#main-div .search-student').val("1");
                $('#main-div .citizenship-id').val($('#main-div').attr('data-citizenship'));
             
                $('.advanced-upd').css('right', '0')

            });


        }
        catch (err) {
            console.error(err);
        }
    });
    
    $('#main-div').on('click', '.btn-advanced-search-button', function (e) {
        try {
            var type = $(this).attr('data-type');
            $('#main-div .student-advanced-search-modal').modal({
                backdrop: false
            });
            var param = $('#main-div .student-advanced-search-form').serialize();


            if (type === 's') {
                Accounting.Proxy.loadStudents('', param, function () {
                    $('#main-div .student-advanced-search-modal').modal('hide');
                });
            }
            else if (type === 'e') {
                Accounting.Proxy.loadTeachers('', param, function () {
                    $('#main-div .student-advanced-search-modal').modal('hide');
                });
            }

        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#operation_1000057', function (e) {
        try {
            if (!$('#buttons_div').attr('data-id')) {
                $.notify(Accounting.dictionary[Accounting.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            var id = $('.main-content-upd #buttons_div').attr('data-id');
            var status = $(this).attr('data-status');
            if (status == 1000341) {
                $('#main-div .student-operation-div').remove();
            }
            if (localStorage.button == undefined) {
                localStorage.setItem('button', 'operation_1000057');
                localStorage.setItem('personId', id)
            }
            window.open(window.location.href, '_blank');


        }
        catch (err) {
            console.error(err);
        }

    });

    $('body').on('click', '#operation_1000065', function () {
        try {

            if (!$('#buttons_div').attr('data-id')) {
                $.notify(Accounting.dictionary[Accounting.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            var id = $('.main-content-upd #buttons_div').attr('data-id');
            $('.add-new .search-scroll').load('partials/student_edit_personal_info.html', function () {
                Accounting.Proxy.getStudentDetails(id, function (data) {
                    var html = '';

                    if (data.image && data.image.path) {
                        $('body .input-file-con .new-img-con').fadeIn(1);
                        $('body .input-file-con .new-img-con img').attr('src', Accounting.urls.HSIS + 'students/image/'+(data.image.path ? data.image.path : '')+'?token=' + Accounting.token + '&size=200x200&' + Math.random());

                        $('body .input-file-con .new-img-con').attr('data-id', data.image.id);
                        $('body .input-file-con .new-img-con img').on('error', function (e) {
                            $('body .input-file-con .new-img-con img').attr('src', 'assets/img/guest.png');
                        });

                    }

                    $('#firstname').val(data.firstName);
                    $('#lastname').val(data.lastName);
                    $('#middlename').val(data.middleName);
                    $('#pincode').val(data.pinCode).attr('disabled', 'disabled');
                    $('#citizenship').find('option[value="' + data.citizenship.id + '"]').attr('selected', 'selected');
                    $('#gender').find('option[value="' + data.gender.id + '"]').attr('selected', 'selected');
                    $('#marital_status').find('option[value="' + data.maritalStatus.id + '"]').attr('selected', 'selected');
                    $('#social_status').find('option[value="' + data.socialStatus.id + '"]').attr('selected', 'selected');
                    $('#orphan_degree').find('option[value="' + data.orphanDegree.id + '"]').attr('selected', 'selected');
                    $('#military_status').find('option[value="' + data.militaryService.id + '"]').attr('selected', 'selected');
                    $('#nationality').find('option[value="' + data.nationality.id + '"]').attr('selected', 'selected');
                    $('.date-birthdate').val(data.birthDate);
                    $('#main-div').attr('data-id', data.id);
                    $('#main-div').attr('data-pelc-id', data.pelcId);
                    $('#disability_degree').find('option[value="' + data.disabilityDegree.id + '"]').prop('selected', true);

                    Accounting.Service.parseEditStudentAddress(data);

                    if (data.contacts.length > 0) {
                        $('.contact-info .panel-body').html(Accounting.Service.parseEditStudentContact(data));
                    }

                    var personal = 'personal';
                    var academic = 'academic';
                    var school = 'school';
                    if (data.documents.length > 0) {
                        $('.add-doc-block .panel-body').html(Accounting.Service.parseEditStudentDocument(data.documents, personal));
                    }
                    $('.student-relationships-div .panel-body').html(Accounting.Service.parseStudentRelationShip(data.relations));
                });
            });
            $('.add-new').css('right', '0');
        }
        catch (err) {
            console.error(err);
        }
    });



    $('#main-div').on('click', '.change-password-submit', function () {
        var isValid = true;

        $(this).parents('.modal-content').find('input.required').each(function () {
            if (!$(this).val()) {
                $(this).addClass('error-border');
                isValid = false;
            }
            else {
                $(this).removeClass('error-border');
            }
        });


        if (!isValid)
            return false;

        var lpass = $('#main-div .last-password').val();
        var npass = $('#main-div .new-password').val();
        var cpass = $('#main-div .confirmed-password').val();
        if (npass !== cpass) {

            $.notify(Accounting.dictionary[Accounting.lang]['wrong_repeated_password'], {
                type: 'danger'
            });

            return false;

        }

        var password = {};
        password.lastPassword = lpass;
        password.password = npass;
        password.passwordConfirmation = cpass;

        Accounting.Proxy.changePassword(password, function (data) {
            if (data) {
                if (data.code == Accounting.statusCodes.OK) {
                    $('#main-div .last-password').removeClass('error-border');
                    $('#main-div .settings-password-modal').modal("hide");
                    $.notify(Accounting.dictionary[Accounting.lang]['success'], {
                        type: 'success'
                    });
                    $('#main-div #logoutForm').find('button[type="submit"]').click();
                }
                else if (data.code == Accounting.statusCodes.INVALID_PARAMS) {
                    $.notify(Accounting.dictionary[Accounting.lang]['wrong_password'], {
                        type: 'danger'
                    });
                    $('#main-div .last-password').addClass('error-border');
                }

            }
        });

    });

    $('#main-div').on('click', '#operation_1000073', function () {
        $('#main-div #exportModal').modal();
        $('#main-div #exportModal').attr('data-module', 'students')

    })
    $('#main-div').on('click', '#operation_1000072', function () {
        $('#main-div #exportModal').modal();
        $('#main-div #exportModal').attr('data-module', 'teachers')

    })
    $('#main-div').on('click', '[close]', function () {
        try {
            $(this).parents('.modal-content').addClass('hidden');
        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', 'a.button-icon', function (e) {
        try {
            var id = $(this).attr('data-id');
            if (id == Accounting.appId) {
                e.preventDefault();
            }
        }
        catch (err) {
            console.error(err);
        }
    });


    $('#main-div').on('click', '#operation_1000094', function () {
        try {
            $('#jstree').jstree('deselect_all');

            var id = $(this).parents('#buttons_div').attr('data-id');
            var dicId = $(this).parents('#buttons_div').attr('data-dictype-id');
            if (!id) {
                $.notify(Accounting.dictionary[Accounting.lang]['select_parent_node'], {
                    type: 'warning'
                });
                return false;
            }

            Accounting.operationList = "view";
            $('.main-content-upd').load('partials/org_tree_view.html', function () {
                $('#main-div .show-html').attr('data-id', id);
                if (dicId != 1000073) {
                    $('#main-div .show-html').remove();
                }

                if (dicId != 1000056 && dicId != 1000073) {
                    $('#main-div .org-structure').remove();
                    $('#main-div .org_address').remove();
                }
                else {
                    $('#main-div .org_address').removeClass('hidden');
                }
                if (dicId == 1000073) {
                    $('#main-div .university-type').removeClass('hidden');
                }
                if (dicId == 1000057) {
                    $('.structure-name-input').addClass('hidden');
                    $('.structure-name-filter').removeClass('hidden');
                    $('#orgName').removeAttr('required');
                    $('#orgCode').removeAttr('required');
                    Accounting.Proxy.loadDictionariesByTypeId('1000035', 0, function (specialityTypes) {
                        var html = Accounting.Service.parseDictionaryForSelect(specialityTypes);
                        $('#speciality_types').html(html);
                    });

                }

                $('#main-div #orgBack').attr('data-org-id', dicId);
                $('body').find('#orgId').val(id);

            });

        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#search-student-form', function () {


        $('body').find('input[name="tempOrgId"]').val($('body').find('#atm_id').val() + ',' + $('body').find('#advanced_faculty').val() + ',' + $('body').find('#org_name_select_advanced').val())

        $('#main-div .search-student').val("1");
        var formSearch = $('#main-div .student-advanced-search-form').serialize();
        var form = $('#main-div .student-advanced-search-form').serializeArray();
        sessionStorage.setItem('studentSearch', JSON.stringify(form));
      

        Accounting.tempData.form = formSearch 




        Accounting.Proxy.loadStudents('', Accounting.tempData.form, function(){
            $('.advanced-upd').css('right', '-100%');
        });

        
        return false
    })
    setTimeout(function () {
        window.onpopstate = function (e) {

            if (e.state != null) {
                if ($('.module-item')) {
                    $('.main-content-upd').load('partials/module_' + e.state.page + '.html?' + Math.random(), function () {
                        $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');

                    });
                }
            }

        }, 0
    });

    $('#main-div').on('click', '#btn_cancel', function () {
        try {
            $('#main-div').load('partials/module_' + Accounting.currModule + '.html');
        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#close-search', function (e) {
        $('.advanced-upd').css('right', '-100%');

        var form = $('#main-div .student-advanced-search-form').serializeArray();

        sessionStorage.setItem('studentSearch', JSON.stringify(form));

        return false
    });
    $('body').on('click', '.close-student-search', function (e) {
        $('.advanced-upd').css('right', '-100%');

        return false
    });

    $('body').on('click', '#clear-filters', function () {
        $('.search-scroll input').val('');
        $('.search-scroll select').val(0);
        if (sessionStorage.teacherSearch != undefined) {
            sessionStorage.removeItem('teacherSearch');
        }
        return false
    });

    $('body').on('click', '.close-student-search', function () {
        $('.add-new').css('right', '-100%');
        $('.dependency-student').css('right', '-100%');
        $('.remove-diplom-div').css('right', '-100%');
    });
    $('body').find('.table-scroll').slimScroll();
    
    $("body").on('change', '.input-file-con input', function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#image").attr("src", e.target.result);
                $("#crop-modal").modal("show");
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    $("body").on("shown.bs.modal", '#crop-modal', function () {
        var $image = $("#image");
        var cropBoxData;
        var canvasData;
        $image.cropper({
            viewMode: 1,
            aspectRatio: 1 / 1,
            minCropBoxWidth: 200,
            minCropBoxHeight: 200,
            ready: function () {
                $image.cropper("setCanvasData", canvasData);
                $image.cropper("setCropBoxData", cropBoxData);
            }
        });
    }).on('hidden.bs.modal', '#crop-modal', function(){
        var $image = $("#image");
        $image.cropper("destroy");
    })

    $('body').on('click', 'button.crop', function(){
      var $image = $("#image");
      var cropBoxData;
      var canvasData;
      cropBoxData = $image.cropper("getCropBoxData");
      canvasData = $image.cropper("getCanvasData");
      getCanvasT = $image.cropper("getCroppedCanvas", {
          width: 150,
          height: 150
      });

      var canvas = getCanvasT;
      var img = canvas.toDataURL("image/jpeg");



      $('body .input-file-con .new-img-con').fadeIn(1).html('<img src="' + img + '" />');
     

      $image.cropper('getCroppedCanvas').toBlob(function (blob) {
          cropForm.append('image', blob);
      });
       $image.cropper("destroy");
    });
    
    var $inputImage = $('#inputImage'),
            URL = window.URL || window.webkitURL,
            blobURL;

        if (URL) {
            $inputImage.change(function() {
                var files = this.files,
                    file;

                if (!$image.data('cropper')) {
                    return;
                }

                if (files && files.length) {
                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        blobURL = URL.createObjectURL(file);
                        $image.one('built.cropper', function() {
                            URL.revokeObjectURL(blobURL); // Revoke when load complete
                        }).cropper('reset').cropper('replace', blobURL);
                        $inputImage.val('');
                    } else {
                        alert('Please choose an image file.');
                    }
                }
            });
        } else {
            $inputImage.parent().remove();
        }
        
        $('#main-div').on('click', '.get-iamas-photo', function () {
            var pincode = $('body #pincode').val();
            cropForm = new FormData();
            Accounting.Proxy.getPersonInfoByPinCode(pincode, function (iamasdata) {
                    $('body .input-file-con .new-img-con').fadeIn(1)
                    if (iamasdata && iamasdata.image.file !== null) {
                        $('body .input-file-con .new-img-con img').attr('src', "data:image/png;base64," + iamasdata.image.file);
                        $('body .input-file-con .new-img-con img').on('error', function (e) {
                            $(this).attr('src', 'assets/img/guest.png');
                        });
                    }
                    else {
                        $('body .input-file-con .new-img-con img').attr('src', 'assets/img/guest.png');
                    }


            });
        });
    
    $('body').on('click', '#student_list tbody tr', function (e) {
        try {
            var tr = $(this);
            var pelcId = $(this).attr('data-pelc-id');
            var eduYear = $(this).attr('data-edu-year');
            var eduType = $(this).attr('data-edu-level');
            var firstName = $(this).attr('data-firstname');
            var lastName = $(this).attr('data-lastname');
            var middleName = $(this).attr('data-middle-name');
            var speciality = $(this).attr('data-speciality');
            var totalAmount = $(this).attr('data-total-amount');
            var paidAmount = $(this).attr('data-paid-amount');
            var restAmount = $(this).attr('data-rest-amount');
            
            $('body').attr('data-pelc-id', pelcId)
            $('body').attr('data-edu-year', eduYear)
            $('body').attr('data-edu-type', eduType)
            $('body').attr('data-firstname', firstName)
            $('body').attr('data-lastname', lastName)
            $('body').attr('data-middle-name', middleName)
            $('body').attr('data-speciality', speciality)
            
            
            $('body').find('#pelc_name_sp').text(firstName)
            $('body').find('#pelc_last_name_sp').text(lastName)
            $('body').find('#pelc_second_name_sp').text(middleName)
            $('body').find('#pelc_spec_name_sp').text(speciality)
            $('body').find('#pelc_total_amount').text(totalAmount)
            $('body').find('#pelc_paid_amount').text(paidAmount)
            $('body').find('#pelc_rest_amount').text(restAmount)
            
            Accounting.Proxy.getPelcInstallment(pelcId, function (data) {
                if (data) {
                    var html='';
                    var html2='';
                        $.each(data.pI, function (i, v) {
                            html += '<tr data-id = "' + v.id + '" data-edu-id ="' + v.uniId + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.eduYearId.value[Accounting.lang] + '</td>' +
                                    '<td>' + v.paymentAmount + '</td>' +
                                    '<td>' + v.paymentDate + '</td>' +
//                                    '<td>' + v.restAmount + '</td>' +
                                    '</tr>';
                            $('body').attr('data-edu-id', v.eduId)
                            });
                        $('body  #pelc_payment_history tbody').html(html);
                        
                        $.each(data.pP, function (i, v) {
                            html2 += '<tr data-id= "' + v.id + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.lastPayDate + '</td>' +
                                    '<td>' + v.amount + '</td>' +
                                    '</tr>';
                            
                            });
                        $('body  #spec_pay-history tbody').html(html2);
                    } 
                })
            var statusId = tr.attr('data-status-id');
            var obj = {
                status: {
                    id: statusId.length > 0 ? statusId : 0
                }
            };
            
            $('.type_2_btns').html(Accounting.Service.parseOperations(Accounting.operationList, '2', obj));
            $('body').find('.col-sm-12.student-list').removeClass('col-sm-12').addClass('col-sm-6');
            $('body').find('.col-sm-6.history_panel').fadeIn(1).css('right', '0');
            $('body').find('#student_list tr').removeClass('active');
            
            $(this).addClass('active')
        }
        catch (err) {
            console.error(err);
        }
    });
    
    $('body').on('change', '#org_uni_filter_for_spec', function () {
        var id = $(this).val();
        Accounting.Proxy.getUniSpecialities(id, function (data) {
            var html = '';
            var specialityCount = data.length;
            var count = $('#profession_list tbody tr').length;
            if(specialityCount > 0){
                $('span[data-speciality-count]').html(specialityCount);
            }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.specialities.id + '" data-spec-name="' + v.specialities.value[Accounting.lang] +'">' +
                        '<td>' + (++count) + '</td>' +
                        '<td>' + v.specialities.value[Accounting.lang] + '</td>' +
                        '<td></td>' +
                        '</tr>'
                })
                $('#profession_list tbody').html(html)
        })
    })
    $('body').on('click', '#profession_list tbody tr', function (e) {
        try {
            var specId = $(this).attr('data-id');
            var specName = $(this).attr('data-spec-name');
            $('body').attr('spec-id', specId)
            $('body').attr('spec-name', specName)
            
            Accounting.Proxy.getPaymentsBySpec(specId, function (data) {
                if (data) {
                    var html='';
                    $.each(data, function (i, v) {
                        html += '<tr data-id= "' + v.id + '">' +
                                '<td>' + (++i) + '</td>' +
                                '<td>' + v.amount + '</td>' +
                                '<td>' + v.startYear + '</td>' +
                                '<td>' + v.endYear + '</td>' +
                                '</tr>';

                        });
                    $('body #profession_detail_list tbody').html(html);
                }
            });
            $('.type_2_btns').html(Accounting.Service.parseOperations(Accounting.operationList, '2'));
            $('body').find('.col-sm-12.profession-div').removeClass('col-sm-12').addClass('col-sm-6');
            $('body').find('.col-sm-6.prof-info').fadeIn(1).css('right', '0');
            $('body').find('#profession_list tr').removeClass('active');
            
            $(this).addClass('active')
        }
        catch (err) {
            console.error(err);
        }
    });
      
    $('body').on('click', '#operation_1001373', function () {
        $('body').find('.add-new .search-scroll').load('partials/add_speciality.html', function () {
            var specId = $('body').attr('spec-id');
            var specName = $('body').attr('spec-name');
            $('body').find("#pelc_spec_name").val(specName)
                Accounting.Proxy.getPaymentsBySpec(specId, function (data) {
                if (data) {
                    var html = ''                    
                    $.each(data, function (i, v) {
                            html += '<div class="col-md-12 for-align spec-payment-info">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>Başlanğıc tarixi</th>' +
                                    '<th>Bitiş tarixi</th>' +
                                    '<th>Məbləğ</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr data-id="' + v.id + '" data-start-date="' + v.startYear + '" data-end-date ="' + v.endYear + '" data-spec-amount ="' + v.amount + '">' +
                                    '<td>' + v.startYear + ' </td>' +
                                    '<td>' + v.endYear + ' </td>' +
                                    '<td>' + v.amount + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a data-id="' + v.id + '" data-start-date="' + v.startYear + '" data-end-date ="' + v.endYear + '" data-spec-amount ="' + v.amount + '" href="#" class="edit-spec-payment">' + Accounting.dictionary[Accounting.lang]['edit'] + '</a></li>' +
                                    '<li><a delete-spec-payment href="#" class="erase-spec-payment">' + Accounting.dictionary[Accounting.lang]['erase'] + '</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '</div>';

                            })
                        $('#append_payed_spec').html(html);
                    }
                })
            $('body').find('.add-new').css('right', '0');
        });
    });
    
    $('body').on('click', '#operation_1001368', function (e) {
        $('body').find('.add-new .search-scroll').load('partials/add_payment.html', function () {
            var pelcId = $('body').attr('data-pelc-id');
            var eduYear = $('body').attr('data-edu-type');
            var firstName = $('body').attr('data-firstname');
            var lastName = $('body').attr('data-lastname');
            var middleName = $('body').attr('data-middle-name');
            var speciality = $('body').attr('data-speciality');
            
            $('body').find("#pelc_first_name").val(firstName)
            $('body').find("#pelc_last_name").val(lastName)
            $('body').find("#pelc_middle_name").val(middleName)
            $('body').find("#pelc_edu_level_name").val(eduYear)
            $('body').find("#pelc_spec_name").val(speciality)
            Accounting.Proxy.getPelcInstallment(pelcId, function (data) {
                if (data) {
                        var html = '';
                        $.each(data.pI, function (i, v) {
                            html += '<div class="col-md-12 for-align payment-info">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>Tədris ili</th>' +
                                    '<th>Məbləğ</th>' +
                                    '<th>Ödəniş tarixi</th>' +
//                                    '<th>Qalıq</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr data-id="' + v.id + '" data-edu-year="' + v.eduYearId.id + '" data-amount ="' + v.paymentAmount + '" data-pay-date="' + v.paymentDate + '" data-res-amount ="' + v.restAmount + '">' +
                                    '<td>' + v.eduYearId.value[Accounting.lang] + ' </td>' +
                                    '<td>' + v.paymentAmount + ' </td>' +
                                    '<td>' + v.paymentDate + ' </td>' +
//                                    '<td>' + v.restAmount + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a data-edu-year="' + v.eduYearId.id + '" data-amount ="' + v.paymentAmount + '" data-pay-date="' + v.paymentDate + '" href="#" class="edit-payment ">' + Accounting.dictionary[Accounting.lang]['edit'] + '</a></li>' +
                                    '<li><a delete-payment href="#" class="erase-payment" data-erase-type="edit-page">' + Accounting.dictionary[Accounting.lang]['erase'] + '</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '</div>';

                            })
                        $('#append_payed_history').html(html);
                    }
                })
            $('body').find('.add-new').css('right', '0');
        });
    });
    
        $('body').on('click', '.first-tab', function (e) {
            try {
                $('#education_time').val(0);
                $('#pay_date').val('');
                $('#payed_amount').val('');
                $('#add_payment_modal').modal();
                $('body').find('#confirm-payment').attr('data-type', 'add');
            }
            catch (err) {
                console.error(err);
            }
        });
        
        $('body').on('click', '.spec-add-tab', function (e) {
            try {
                $('#start_date').val('');
                $('#end_date').val('');
                $('#amount').val('');
                $('#add_spec_payment_modal').modal();
                $('body').find('#confirm_spec_payment').attr('data-type', 'add');
            }
            catch (err) {
                console.error(err);
            }
        });
        
        $('body').on('click', '#confirm_spec_payment[data-type="add"]', function () {
            var specId = $('body').attr('spec-id')
            var form = {
                startYear: $('body').find('#start_date').val(),
                endYear: $('body').find('#end_date').val(),
                specAmount: $('body').find('#amount').val()
            }
            Accounting.Proxy.addSpecInstallment(specId, form, function (e) {
                Accounting.Proxy.getPaymentsBySpec(specId, function (data) {
                if (data) {
                    var html = ''                    
                    $.each(data, function (i, v) {
                            html += '<div class="col-md-12 for-align spec-payment-info">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>Başlanğıc tarixi</th>' +
                                    '<th>Bitiş tarixi</th>' +
                                    '<th>Məbləğ</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr data-id="' + v.id + '" data-start-date="' + v.startYear + '" data-end-date ="' + v.endYear + '" data-spec-amount ="' + v.amount + '">' +
                                    '<td>' + v.startYear + ' </td>' +
                                    '<td>' + v.endYear + ' </td>' +
                                    '<td>' + v.amount + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a data-start-date="' + v.startYear + '" data-end-date ="' + v.endYear + '" data-spec-amount ="' + v.amount + '" href="#" class="edit-spec-payment">' + Accounting.dictionary[Accounting.lang]['edit'] + '</a></li>' +
                                    '<li><a delete-spec-payment href="#" class="erase-spec-payment">' + Accounting.dictionary[Accounting.lang]['erase'] + '</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '</div>';

                            })
                        $('#append_payed_spec').html(html);
                    }
                })
                $('#add_spec_payment_modal').modal('hide');
            })
        });
        
        $('body').on('click', '#confirm_spec_payment[data-type="edit"]', function () {
            var specId = $('body').attr('spec-id');
            var form = {
                installmentId: $('body').attr('data-id'),
                startYear: $('body').find('#start_date').val(),
                endYear: $('body').find('#end_date').val(),
                specAmount: $('body').find('#amount').val()
            }
            Accounting.Proxy.updateSpecInstallmen(specId, form, function (e) {
                Accounting.Proxy.getPaymentsBySpec(specId, function (data) {
                    if (data) {
                        var html = ''                    
                        $.each(data, function (i, v) {
                                html += '<div class="col-md-12 for-align spec-payment-info">' +
                                        '<table class="table-block col-md-12">' +
                                        '<thead>' +
                                        '<th>Başlanğıc tarixi</th>' +
                                        '<th>Bitiş tarixi</th>' +
                                        '<th>Məbləğ</th>' +
                                        '</tr></thead>' +
                                        '<tbody>' +
                                        '<tr data-id="' + v.id + '" data-start-date="' + v.startYear + '" data-end-date ="' + v.endYear + '" data-spec-amount ="' + v.amount + '">' +
                                        '<td>' + v.startYear + ' </td>' +
                                        '<td>' + v.endYear + ' </td>' +
                                        '<td>' + v.amount + ' </td>' +
                                        '</tr>' +
                                        '</tbody>' +
                                        '</table>' +
                                        '<div class="operations-button">' +
                                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                        ' class="glyphicon glyphicon-list"></span></div>' +
                                        '<ul class="dropdown-menu">' +
                                        '<li><a data-start-date="' + v.startYear + '" data-end-date ="' + v.endYear + '" data-spec-amount ="' + v.amount + '" href="#" class="edit-spec-payment">' + Accounting.dictionary[Accounting.lang]['edit'] + '</a></li>' +
                                        '<li><a delete-spec-payment href="#" class="erase-spec-payment">' + Accounting.dictionary[Accounting.lang]['erase'] + '</a></li>' +
                                        '</ul>' +
                                        '</div>' +
                                        '</div>';

                                })
                            $('#append_payed_spec').html(html);
                            $('.add_spec_payment_modal').modal('hide');    
                        }
                    })
                })
            });
        
         $('body').on('click', '.erase-spec-payment', function () {
            var object = $(this);
            object.parents('div.spec-payment-info').addClass('selected');
            var paymentId = $(this).parents('.col-md-12.for-align.spec-payment-info').find('tbody tr').attr('data-id');
            var specId = $('body').attr('spec-id');
                $.confirm({
                title: Accounting.dictionary[Accounting.lang]['warning'],
                content: Accounting.dictionary[Accounting.lang]['delete_info'],
                confirm: function () {
                    Accounting.Proxy.removeSpecInstallment(specId, paymentId, function (e) {
                        Accounting.Proxy.getPaymentsBySpec(specId, function (data) {
                            if (data) {
                                var html = ''                    
                                $.each(data, function (i, v) {
                                    html += '<div class="col-md-12 for-align spec-payment-info">' +
                                            '<table class="table-block col-md-12">' +
                                            '<thead>' +
                                            '<th>Başlanğıc tarixi</th>' +
                                            '<th>Bitiş tarixi</th>' +
                                            '<th>Məbləğ</th>' +
                                            '</tr></thead>' +
                                            '<tbody>' +
                                            '<tr data-id="' + v.id + '" data-start-date="' + v.startYear + '" data-end-date ="' + v.endYear + '" data-spec-amount ="' + v.amount + '">' +
                                            '<td>' + v.startYear + ' </td>' +
                                            '<td>' + v.endYear + ' </td>' +
                                            '<td>' + v.amount + ' </td>' +
                                            '</tr>' +
                                            '</tbody>' +
                                            '</table>' +
                                            '<div class="operations-button">' +
                                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                            ' class="glyphicon glyphicon-list"></span></div>' +
                                            '<ul class="dropdown-menu">' +
                                            '<li><a data-start-date="' + v.startYear + '" data-end-date ="' + v.endYear + '" data-spec-amount ="' + v.amount + '" href="#" class="edit-spec-payment">' + Accounting.dictionary[Accounting.lang]['edit'] + '</a></li>' +
                                            '<li><a delete-spec-payment href="#" class="erase-spec-payment">' + Accounting.dictionary[Accounting.lang]['erase'] + '</a></li>' +
                                            '</ul>' +
                                            '</div>' +
                                            '</div>';

   
                                    });
                                $('#append_payed_spec').html(html);
                                $('.add_spec_payment_modal').modal('hide');
                            }
                        })    
                    });
                },
                theme: 'black'
            });            
        });
        
        $('body').on('click', '#confirm-payment[data-type="add"]', function () {
            var pelcId = $('body').attr('data-pelc-id')
            var form = {
                eduYearStartId: $('#education_time').val(),
                paymentDate: $('#pay_date').val(),
                paymentAmount: $('#payed_amount').val(),
            }
            Accounting.Proxy.addPelcInstallment(pelcId, form, function (e) {
                Accounting.Proxy.loadStudents();
                Accounting.Proxy.getPelcInstallment(pelcId, function (data) {
                if (data) {
                        var html = '';
                        $.each(data.pI, function (i, v) {
                            html += '<div class="col-md-12 for-align payment-info">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>Tədris ili</th>' +
                                    '<th>Məbləğ</th>' +
                                    '<th>Ödəniş tarixi</th>' +
//                                    '<th>Qalıq</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr data-id="' + v.id + '" data-edu-year="' + v.eduYearId.id + '" data-amount ="' + v.paymentAmount + '" data-pay-date="' + v.paymentDate + '">' +
                                    '<td>' + v.eduYearId.value[Accounting.lang] + ' </td>' +
                                    '<td>' + v.paymentAmount + ' </td>' +
                                    '<td>' + v.paymentDate + ' </td>' +
//                                    '<td>' + v.restAmount + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a data-edu-year="' + v.eduYearId.id + '" data-amount ="' + v.paymentAmount + '" data-pay-date="' + v.paymentDate + '" data-res-amount ="' + v.restAmount + '" href="#" class="edit-payment">' + Accounting.dictionary[Accounting.lang]['edit'] + '</a></li>' +
                                    '<li><a delete-payment href="#" class="erase-payment">' + Accounting.dictionary[Accounting.lang]['erase'] + '</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '</div>';

                            })
                        $('#append_payed_history').html(html);
                        $('.add_payment_modal').modal('hide');    
                    }
                })
            })
        });
        
        $('body').on('click', '.close-payment-add', function () { 
            $('body').find('.col-sm-6.info').fadeOut(1).css('right', '-100%');
            $('body').find('.col-sm-6.data').removeClass('col-sm-6').addClass('col-sm-12');
            $('.add-new').css('right', '-100%');
            return false
        });
        
        $('body').on('click', '.edit-spec-payment', function () {
            try {
                var object = $(this);
                object.parents('div.spec-payment-info').addClass('selected');
                var id = $(this).parents('.col-md-12.for-align.spec-payment-info').find('tbody tr').attr('data-id');
                var startYear = object.attr('data-start-date');
                var endYear = object.attr('data-end-date');
                var amount = object.attr('data-spec-amount');
                var modal = $('body').find('#add_spec_payment_modal');
                $('body').attr('data-id', id);
                modal.modal();
                $('body').find('#start_date').val(startYear);
                $('body').find('#end_date').val(endYear);
                $('body').find('#amount').val(amount);
                $('body').find('#confirm_spec_payment').attr('data-type', 'edit');
            } catch (e) {

            }
        });
        
        $('body').on('click', '.edit-payment', function () {
            try {
                var object = $(this);
                object.parents('div.payment-info').addClass('selected');
                var id = $(this).parents('.col-md-12.for-align.payment-info').find('tbody tr').attr('data-id');
                var eduYear = object.attr('data-edu-year');
                var paymentDate = object.attr('data-pay-date');
                var amount = object.attr('data-amount');
                var modal = $('body').find('#add_payment_modal');
                $('body').attr('data-id', id);
                modal.modal();
                $('body').find('#pay_date').val(paymentDate);
                $('body').find('#education_time').find('option[value="' + eduYear + '"]').prop('selected', true);
                $('body').find('#payed_amount').val(amount);
                $('body').find('#confirm-payment').attr('data-type', 'edit');
                
            } catch (e) {

            }
        });
        
        $('body').on('hidden.bs.modal', '.modal', function(){
            $('body').removeAttr('data-payment-id')
            $('body').find('.payment-info').removeClass('selected');
       })
        
        $('body').on('click', '#confirm-payment[data-type="edit"]', function () {
            var pelcId = $('body').attr('data-pelc-id')
            var form = {
                installmentId: $('body').attr('data-id'),
                eduYearStartId: $('#education_time').val(),
                paymentDate: $('#pay_date').val(),
                paymentAmount: $('#payed_amount').val(),
            }
            Accounting.Proxy.updateInstallment(pelcId, form, function (e) {
                Accounting.Proxy.loadStudents();
                Accounting.Proxy.getPelcInstallment(pelcId, function (data) {
                if (data) {
                        var html = '';
                        $.each(data.pI, function (i, v) {
                            html += '<div class="col-md-12 for-align payment-info">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>Tədris ili</th>' +
                                    '<th>Məbləğ</th>' +
                                    '<th>Ödəniş tarixi</th>' +
//                                    '<th>Qalıq</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr data-id="' + v.id + '"data-edu-year="' + v.eduYearId.id + '" data-amount ="' + v.paymentAmount + '" data-pay-date="' + v.paymentDate + '" data-res-amount ="' + v.restAmount + '">' +
                                    '<td>' + v.eduYearId.value[Accounting.lang] + ' </td>' +
                                    '<td>' + v.paymentAmount + ' </td>' +
                                    '<td>' + v.paymentDate + ' </td>' +
//                                    '<td>' + v.restAmount + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a data-edu-year="' + v.eduYearId.id + '" data-amount ="' + v.paymentAmount + '" data-pay-date="' + v.paymentDate + '" data-res-amount ="' + v.restAmount + '" href="#" class="edit-payment ">' + Accounting.dictionary[Accounting.lang]['edit'] + '</a></li>' +
                                    '<li><a delete-payment href="#" class="erase-payment">' + Accounting.dictionary[Accounting.lang]['erase'] + '</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '</div>';

                            })
                        $('#append_payed_history').html(html);
                        $('.add_payment_modal').modal('hide');    
                    }
                })
            })
        });
        
        $('body').on('click', '.erase-payment', function () {
            var object = $(this);
            object.parents('div.payment-info').addClass('selected');
            var paymentId = $(this).parents('.col-md-12.for-align.payment-info').find('tbody tr').attr('data-id');
            var amount =  $(this).parents('.col-md-12.for-align.payment-info').find('tbody tr').attr('data-amount');
            var pelcId = $('body').attr('data-pelc-id');
            if (amount === '0') {

                $.confirm({
                title: Accounting.dictionary[Accounting.lang]['warning'],
                content: Accounting.dictionary[Accounting.lang]['delete_info'],
                confirm: function () {
                    Accounting.Proxy.removeInstallment(pelcId, paymentId, function (e) {
                        Accounting.Proxy.getPelcInstallment(pelcId, function (data) {
                            if (data) {
                                var html = '';
                                $.each(data.pI, function (i, v) {
                                    html += '<div class="col-md-6 for-align payment-info">' +
                                            '<table class="table-block col-md-12">' +
                                            '<thead>' +
                                            '<th>Tədris ili</th>' +
                                            '<th>Məbləğ</th>' +
                                            '<th>Ödəniş tarixi</th>' +
                                            '<th>Qalıq</th>' +
                                            '</tr></thead>' +
                                            '<tbody>' +
                                            '<tr data-id="' + v.id + '" data-edu-year="' + v.eduYearId.id + '" data-amount ="' + v.paymentAmount + '" data-pay-date="' + v.paymentDate + '" data-res-amount ="' + v.restAmount + '">' +
                                            '<td>' + v.eduYearId.value[Accounting.lang] + ' </td>' +
                                            '<td>' + v.paymentAmount + ' </td>' +
                                            '<td>' + v.paymentDate + ' </td>' +
                                            '<td>' + v.restAmount + ' </td>' +
                                            '</tr>' +
                                            '</tbody>' +
                                            '</table>' +
                                            '<div class="operations-button">' +
                                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                            ' class="glyphicon glyphicon-list"></span></div>' +
                                            '<ul class="dropdown-menu">' +
                                            '<li><a data-edu-year="' + v.eduYearId.id + '" data-amount ="' + v.paymentAmount + '" data-pay-date="' + v.paymentDate + '" data-res-amount ="' + v.restAmount + '" href="#" class="edit-payment ">' + Accounting.dictionary[Accounting.lang]['edit'] + '</a></li>' +
                                            '<li><a delete-payment href="#" class="erase-payment">' + Accounting.dictionary[Accounting.lang]['erase'] + '</a></li>' +
                                            '</ul>' +
                                            '</div>' +
                                            '</div>';

                                        })
                                    $('#append_payed_history').html(html);
                                    $('.add_payment_modal').modal('hide');    
                                }
                            })    
                        });
                    },
                    theme: 'black'
                });
            }else{
                $.notify('Ödəniş artıq olub',{type: 'danger'});
            }              
        });
        
        $('body').on('change', '#org_uni_filter', function (e) {
            var orgId = $('#org_uni_filter').val();
            $('body').attr('data-org-id', orgId);
            Accounting.Proxy.getPaymentParts(orgId, function (data) {
                if (data) {
                    var html = '';
                    $.each(data, function (i, v) {
                        html += '<tr data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '">' +
                                '<td>' + (++i) + '</td>' +
                                '<td>' + v.lastPayDate + '</td>' +
                                '<td>' + v.amount + '</td>' +
                                '</tr>';
                    })
                    $('body  #pay_part_t tbody').html(html);
                }
            })
        });

        $('body').on('click', '#operation_1001375', function () {
            $('body').find('.confirm-uni-pay-param').attr('data-type', 'add');
            $('body').find('#tedris-ili').val(0)
            $('body').find('.last-p-date').val('')
            $('body').find('.percent-amount-uni').val('')
            $('.add-percent-for-uni').modal();
        });
        
        $('body').on('click', '.confirm-uni-pay-param[data-type=add]', function () {
            var orgId = $('body').attr('data-org-id');
            var objectForm = {
                lastPayDate: $('.last-p-date').val(),
                amount: $('.percent-amount-uni').val()
            }
            Accounting.Proxy.addPaymentParts(orgId, objectForm, function () {
                Accounting.Proxy.getPaymentParts(orgId, function (data) {
                    if (data) {
                        var html = '';
                        $.each(data, function (i, v) {
                            html += '<tr data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '" \n\
                                    data-edu-year-id = "' + v.eduYear.id + '" data-edu-year = "' + v.eduYear.value.az + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.eduYear.value.az + '</td>' +
                                    '<td>' + v.lastPayDate + '</td>' +
                                    '<td>' + v.amount + '</td>' +
                                    '<td><div class="type_2_btns">' + 
                                    '<div title="Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                    '<img class = "balaca-op" src="assets/img/upd/table-dots.svg"></div>' +
                                    '<ul class="dropdown-menu">' + 
                                    '<li><a data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '" \n\
                                    data-edu-year-id = "' + v.eduYear.id + '" data-edu-year = "' + v.eduYear.value.az + '"\n\
                                    class = "edit-pay-part" href="#">Redaktə et</a></li>' +
                                    '<li><a data-id = "' + v.id + '" class = "delete-payment-part" href="#">Sil</a></li>' +
                                    '</ul></div></td>' +
                                    '</tr>';

                        })
                        $('body  #profession_detail_list tbody').html(html);

                    }
                })
            })
        });
        
        $('body').on('click', '.confirm-uni-pay-param[data-type=edit]', function () {
            var orgId = $('body').attr('data-org-id');
            var objectForm = {
                id: $('body').find('.edit-pay-part').attr('data-id'),
                eduYear: $('#tedris-ili').val(),
                lastPayDate: $('.last-p-date').val(),
                amount: $('.percent-amount-uni').val()
            }
            Accounting.Proxy.updatePaymentParts(orgId, objectForm, function () {
                Accounting.Proxy.getPaymentParts(orgId, function (data) {
                    if (data) {
                        var html = '';
                        $.each(data, function (i, v) {
                            html += '<tr data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '" \n\
                                    data-edu-year-id = "' + v.eduYear.id + '" data-edu-year = "' + v.eduYear.value.az + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.eduYear.value.az + '</td>' +
                                    '<td>' + v.lastPayDate + '</td>' +
                                    '<td>' + v.amount + '</td>' +
                                    '<td><div class="type_2_btns">' + 
                                    '<div title="Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                    '<img class = "balaca-op" src="assets/img/upd/table-dots.svg"></div>' +
                                    '<ul class="dropdown-menu">' + 
                                    '<li><a data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '" \n\
                                    data-edu-year-id = "' + v.eduYear.id + '" data-edu-year = "' + v.eduYear.value.az + '"\n\
                                    class = "edit-pay-part" href="#">Redaktə et</a></li>' +
                                    '<li><a data-id = "' + v.id + '" class = "delete-payment-part" href="#">Sil</a></li>' +
                                    '</ul></div></td>' +
                                    '</tr>';

                            })
                        $('body  #profession_detail_list tbody').html(html);

                    }
                })
            })
        });
        
        $('body').on('click', '.delete-payment-part', function () {
            var orgId = $('body').attr('data-org-id');
            var id = $('body').find('.edit-pay-part').attr('data-id')
            $.confirm({
                title: Accounting.dictionary[Accounting.lang]['warning'],
                content: Accounting.dictionary[Accounting.lang]['delete_info'],
                confirm: function () {
                    Accounting.Proxy.removePaymentParts(orgId, id, function () {
                        Accounting.Proxy.getPaymentParts(orgId, function (data) {
                            if (data) {
                                var html = '';
                                $.each(data, function (i, v) {
                                    html += '<tr data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '" \n\
                                            data-edu-year-id = "' + v.eduYear.id + '" data-edu-year = "' + v.eduYear.value.az + '">' +
                                            '<td>' + (++i) + '</td>' +
                                            '<td>' + v.eduYear.value.az + '</td>' +
                                            '<td>' + v.lastPayDate + '</td>' +
                                            '<td>' + v.amount + '</td>' +
                                            '<td><div class="type_2_btns">' + 
                                            '<div title="Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                            '<img class = "balaca-op" src="assets/img/upd/table-dots.svg"></div>' +
                                            '<ul class="dropdown-menu">' + 
                                            '<li><a data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '" \n\
                                            data-edu-year-id = "' + v.eduYear.id + '" data-edu-year = "' + v.eduYear.value.az + '"\n\
                                            class = "edit-pay-part" href="#">Redaktə et</a></li>' +
                                            '<li><a data-id = "' + v.id + '" class = "delete-payment-part" href="#">Sil</a></li>' +
                                            '</ul></div></td>' +
                                            '</tr>';

                                    })
                                $('body  #profession_detail_list tbody').html(html);

                            }
                        })
                    })
                },
                theme: 'black'
            });
        });
        
        $('body').on('click', '.edit-pay-part', function () {
            var lastDate = $(this).attr('data-l-date');
            var minAmount = $(this).attr('data-uni-min-pay');
            var eduYear = $(this).attr('data-edu-year-id');
                  
            $('body').find('.last-p-date').val(lastDate)
            $('body').find('.percent-amount-uni').val(minAmount)
            $('body').find('#tedris-ili').find('option[value="' + eduYear +'"]').prop('selected',true);
            
            $('body').find('.confirm-uni-pay-param').attr('data-type', 'edit');
            $('.add-percent-for-uni').modal();
        });
        
        $('body').on('click', '#operation_1000076', function () {
            $('body').find('.last-p-date').val('')
            $('body').find('.percent-amount-uni').val('')
            $('body').find('#tedris-ili').val('');
            $('body').find('.confirm-uni-pay-param').attr('data-type', 'add');
            $('.add-percent-for-uni').modal();
        });
        
        $('body').on('click', '#pay_part_t tbody tr', function () {
            var tr = $(this).attr('data-id');
            var uniName = $(this).attr('data-uni-name');
            if(uniName.length >= 65){
                $('span[data-uni-name]').html(uniName.substring(0, 76) + '...');
            }else{
                 $('span[data-uni-name]').html(uniName);
            }
            $('body').attr('data-org-id', tr)
            Accounting.Proxy.getPaymentParts(tr, function (data) {
                if (data) {
                    var html = '';
                    $.each(data, function (i, v) {
                        html += '<tr data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '" \n\
                                data-edu-year-id = "' + v.eduYear.id + '" data-edu-year = "' + v.eduYear.value.az + '">' +
                                '<td>' + (++i) + '</td>' +
                                '<td>' + v.eduYear.value.az + '</td>' +
                                '<td>' + v.lastPayDate + '</td>' +
                                '<td>' + v.amount + '</td>' +
                                '<td><div class="type_2_btns">' + 
                                '<div title="Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                '<img class = "balaca-op" src="assets/img/upd/table-dots.svg"></div>' +
                                '<ul class="dropdown-menu">' + 
                                '<li><a data-id = "' + v.id + '" data-l-date = "' + v.lastPayDate + '" data-uni-min-pay = "' + v.amount + '" \n\
                                data-edu-year-id = "' + v.eduYear.id + '" data-edu-year = "' + v.eduYear.value.az + '"\n\
                                class = "edit-pay-part" href="#">Redaktə et</a></li>' +
                                '<li><a data-id = "' + v.id + '" class = "delete-payment-part" href="#">Sil</a></li>' +
                                '</ul></div></td>' +
                                '</tr>';
                        })
                        
                    $('body  #profession_detail_list tbody').html(html);
                    
                }
            })
           
            $('body').find('.col-sm-12.profession-div').removeClass('col-sm-12').addClass('col-sm-6');
            $('body').find('.col-sm-6.prof-info').fadeIn(1).css('right', '0');
            $('body').find('#pay_part_t tr').removeClass('active');
            
            $(this).addClass('active')
        })
        
        
        $('body').on('keyup', '#student_search', function(){
            
            var elem = $('#profession_list tbody tr');
            var params = $(this).val();
            var count = 0
            
            if(params.trim().length == 0) {
                
                elem.each(function() {
                
                        $(this).removeClass('hidden')
                        $(this).find('td').eq(0).text(++count);

                })
                return false;
            }
            elem.each(function() {
                
                if($(this).find('td:contains('+params+')').length == 0) {
                    $(this).addClass('hidden')
                } else {
                    $(this).removeClass('hidden')
                    $(this).find('td').eq(0).text(++count);
                }
            })
        });
        
        $('body').on('keyup', '#uni_search', function(){
            
            var elem = $('#pay_part_t tbody tr');
            var params = $(this).val();
            var count = 0
            
            if(params.trim().length == 0) {
                
                elem.each(function() {
                
                        $(this).removeClass('hidden')
                        $(this).find('td').eq(0).text(++count);

                })
                return false;
            }
            elem.each(function() {
                
                if($(this).find('td:contains('+params+')').length == 0) {
                    $(this).addClass('hidden')
                } else {
                    $(this).removeClass('hidden')
                    $(this).find('td').eq(0).text(++count);
                }
            })
        });

    $(window).resize(function () {
        var width = window.innerWidth;
        if(width > 1500) {
            $('.app-list').show();
        } else {
            $(document).on('click','.hide-menu',function(e){
                e.stopPropagation();
                var display = $(".app-list").css('display');
                if(display === "none") {
                    $('.app-list').fadeIn();
                } else{
                    $('.app-list').fadeOut();
                }
            });

            $("body").on("click",function() {
                $('.app-list').hide();
            });
        }
    });
});



