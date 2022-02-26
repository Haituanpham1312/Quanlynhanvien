$(document).ready(function() {
    new EmployeePage();
})

class EmployeePage {
    FormMode = null;
    EmployeeIdSelected = null;
    /**
     * Hàm khởi tạo
     */
    constructor() {
        this.loadData();
        //this.loadData1();
        this.loadCombobox();
        this.Events();
    }

    /**
     * Load dữ liệu
     */
    loadData() {
        // Xóa dữ liệu cũ
        $('table#tblEmployee tbody').empty();
        // Hiện loading
        $(".h-loading").show();
        // Gọi API để lấy dữ liệu
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Employees",
            success: function(response) {
                if (response) {
                    var employees = response;

                    $('.h-table-page .h-page-left').empty();
                    let textHTML = `Tổng số: <b>${employees.length}</b> bản ghi`;
                    $('.h-table-page .h-page-left').append(textHTML);

                    for (const employee of employees) {
                        let trHTML = $(`<tr>
                                        <td>
                                            <input type="checkbox" name="" class="h-checkbox">
                                        </td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.EmployeeCode)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.EmployeeName)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.GenderName)}</td>
                                        <td class="text-align-center">${CommonJS.formatDate(employee.DateOfBirth)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.IdentityNumber)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.EmployeePosition)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.DepartmentName)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.BankAccountNumber)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.BankName)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.BankBranchName)}</td>
                                        <td class="text-align-left">
                                            <div class="h-combobox-fix">
                                                <div class="h-fix-text">Sửa</div>
                                                <div id="btnFix" class="h-fix-button"></div>
                                                <div class="h-fix-data">
                                                    <div class="h-fix-data-text">Nhân bản</div>
                                                    <div id="btnDelete" class="h-fix-data-text">Xóa</div>
                                                    <div class="h-fix-data-text">Ngừng sử dụng</div>
                                                </div>
                                            </div>
                                        </td>

                                    </tr>`);

                        // Lưu khóa chính
                        trHTML.data("employeeId", employee.EmployeeId);
                        trHTML.data("data", employee);
                        $('table#tblEmployee tbody').append(trHTML);
                    }

                }
                $(".h-loading").hide();
            }
        });
    }

    // loadData1() {
    //     var data = [];

    //     // Gọi api lấy dữ liệu phân trang:
    //     const searchText = $('#Search').val();
    //     const pageSize = $('#cbxPageSize').val();
    //     const pageNumber = 1;
    //     let apiUrl = `http://amis.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    //     debugger
    //     // Gọi api lấy dữ liệu
    //     $.ajax({
    //         type: "GET",
    //         url: apiUrl,
    //         success: function(response) {
    //             data = response;
    //         },
    //         error: function(res) {
    //             if (res.status == 400) {
    //                 alert("Dữ liệu không hợp lệ")
    //             }
    //         }
    //     });

    //     // Build dữ liệu
    //     for (const employee of data) {

    //     }
    // }

    /**
     * Load dữ liệu combobox
     */

    loadCombobox() {
        // Lấy dữ liệu phòng ban
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Departments",
            success: function(response) {
                // Build combobox
                for (const department of response) {
                    let optionHTML = `<div class="h-combobox-item" value="${department.DepartmentId}">${department.DepartmentName}</div>`
                    $('#cbxDepartmentId .h-combobox-data').append(optionHTML);
                    let itemDataElements = $(cbxDepartmentId).find('.h-combobox-data').html();
                    $(cbxDepartmentId).data('itemDataElement', itemDataElements);
                }

            }
        });
    }

    /**
     * Các sự kiện
     */
    Events() {
        // Reload dữ liệu
        $('#refreshData').click(this.loadData);

        // Thêm mới nhân viên
        $('#btnAddEmloyee').click(this.btnAddEmloyee.bind(this));


        // Lưu dữ liệu nhân viên mới
        $('#btnSaveEmployee').click(this.btnSaveEmployee.bind(this));
        $('#btnSave').click(this.btnSaveEmployee.bind(this));

        //Hiện form chi tiết
        $('table#tblEmployee tbody').on('dblclick', 'tr', this.rowOnDblClick.bind(this));
        $('table#tblEmployee tbody').on('click', 'tr td .h-fix-text', this.fixOnClick.bind(this));

        // Hiện data của btnFix 
        $('table#tblEmployee tbody').on('click', 'tr td #btnFix', this.btnFixOnClick);

        // Xóa nhân viên    
        $('table#tblEmployee tbody').on('click', 'tr td #btnDelete', this.DeleteEmployee.bind(this));


        // Đóng form thêm mới
        // 1. Đóng bằng dấu x
        $('#btnCloseDialog').click(this.btnCloseOnClick);
        // 2. Đóng bằng btn Hủy
        $('#btnCancel').click(this.btnCloseOnClick);

        // Search
        $('#Search').keydown(this.inputOnKeyDown);

        // Đóng popup cảnh báo
        $('#btnOK').click(this.btnOK);

    }

    /**
     * 
     * Đóng popup cảnh báo
     * 
     */
    btnOK() {
        $('#PopupWarning').hide();
    }

    /**
     * Xóa nhân viên
     */
    DeleteEmployee(sender) {
        var self = this;
        let currentRow = sender.currentTarget.parentNode.parentNode.parentNode.parentNode;
        let employeeId = $(currentRow).data('employeeId');
        //debugger
        this.EmployeeIdSelected = employeeId;
        $('#PopupWarningDelete').show();
        $('#btnOKDelete').click(function() {
            $.ajax({
                type: "DELETE",
                url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
                success: function(response) {
                    self.loadData();
                    $('#PopupWarningDelete').hide();

                }
            });
        })
        $('#btnCancelDelete').click(function() {
            $('#PopupWarningDelete').hide();
            //self.loadData();
            $('.h-fix-data').hide();
        })

    }

    /**
     * 
     * Hiện data của btnFix
     */
    btnFixOnClick() {
        //alert('Hiện data fix');
        //debugger
        // 1. xác định combobox data của combobox hiện tại
        let fixData = $(this).siblings('.h-fix-data');
        // 2. Hiển thị
        fixData.toggle();
    }

    /**
     * Click vào Sửa thì hiện form chi tiết
     */
    fixOnClick(sender) {
            //debugger
            $("input").val(null);
            this.FormMode = Enum.FormMode.Update;
            let currentRow = sender.currentTarget.parentNode.parentNode.parentNode;
            // let currentRow = current.currentTarget;
            let employeeId = $(currentRow).data('employeeId');
            //debugger
            this.EmployeeIdSelected = employeeId;
            //debugger
            // Lấy dữ liệu chi tiết nhân viên
            $.ajax({
                type: "GET",
                url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
                success: function(response) {
                    // Binding dữ liệu vào form
                    console.log(response);
                    $('#txtEmployeeCode').val(response.EmployeeCode);
                    $('#txtEmployeeName').val(response.EmployeeName);
                    if (response.DateOfBirth != null) {
                        $('#dtDateOfBirth').val(response.DateOfBirth.substring(0, 10));
                    }

                    $('#numIdentityNumber').val(response.IdentityNumber);
                    if (response.IdentityDate != null) {
                        $('#dtIdentityDate').val(response.IdentityDate.substring(0, 10));
                    }
                    $('#txtEmployeePosition').val(response.EmployeePosition);
                    $('#txtIdentityPlace').val(response.IdentityPlace);
                    $('#txtAddress').val(response.Address);
                    $('#txtPhoneNumber').val(response.PhoneNumber);
                    $('#txtEmail').val(response.Email);
                    $('#txtBankAccountNumber').val(response.BankAccountNumber);
                    $('#txtBankName').val(response.BankName);
                    $('#txtBankBranchName').val(response.BankBranchName);
                    $('#DepartmentName').val(response.DepartmentName);

                    const num = response.Gender;
                    if (num == 1) {
                        document.getElementById("radio-nam").checked = true;
                    } else if (num == 0) {
                        document.getElementById("radio-nu").checked = true;
                    } else if (num == 2) {
                        document.getElementById("radio-khac").checked = true;
                    } else {
                        document.getElementById("radio-nam").checked = false;
                        document.getElementById("radio-nu").checked = false;
                        document.getElementById("radio-khac").checked = false;
                    }
                    // Hiển thị
                    $('#dlgPopup').show();
                }
            });
        }
        /**
         * Search theo tên hoặc mã nhân viên
         */

    inputOnKeyDown() {
        if (event.keyCode == 13) {
            console.log($('#Search').val());
            let input = $('#Search').val();
            $.ajax({
                type: "GET",
                url: `http://amis.manhnv.net/api/v1/Employees/filter?employeeFilter=${input}`,
                success: function(response) {
                    // Xóa dữ liệu cũ
                    $('table#tblEmployee tbody').empty();
                    if (response != null) {
                        let employees = response.Data;
                        $('.h-table-page .h-page-left').empty();
                        let textHTML = `Tổng số: <b>${employees.length}</b> bản ghi`;
                        $('.h-table-page .h-page-left').append(textHTML);
                        for (const employee of employees) {
                            let trHTML = $(`<tr>
                                        <td>
                                            <input type="checkbox" name="" class="h-checkbox">
                                        </td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.EmployeeCode)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.EmployeeName)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.GenderName)}</td>
                                        <td class="text-align-center">${CommonJS.formatDate(employee.DateOfBirth)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.IdentityNumber)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.EmployeePosition)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.DepartmentName)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.BankAccountNumber)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.BankName)}</td>
                                        <td class="text-align-left">${CommonJS.formatData(employee.BankBranchName)}</td>
                                        <td class="text-align-left">
                                            <div class="h-combobox-fix">
                                                <div class="h-fix-text">Sửa</div>
                                                <div id="btnFix" class="h-fix-button"></div>
                                                <div class="h-fix-data">
                                                    <div class="h-fix-data-text">Nhân bản</div>
                                                    <div class="h-fix-data-text">Xóa</div>
                                                    <div class="h-fix-data-text">Ngừng sử dụng</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                    </tr>`);


                            $('table#tblEmployee tbody').append(trHTML);
                            // Xóa nội dung input
                            $('#Search').val(null);

                        }
                    } else {
                        $('#Search').val(null);
                        // alert('Không tìm thấy kết quả phù hợp');
                    }

                },
                error: function(response) {
                    console.log(response);
                }
            });
        }
    }

    /**
     * 
     * Hiện form thông tin chi tiết
     */

    rowOnDblClick(sender) {

        $("input").val(null);
        this.FormMode = Enum.FormMode.Update;
        let currentRow = sender.currentTarget;
        let employeeId = $(currentRow).data('employeeId');
        this.EmployeeIdSelected = employeeId;
        //debugger
        // Lấy dữ liệu chi tiết nhân viên
        $.ajax({
            type: "GET",
            url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
            success: function(response) {
                // Binding dữ liệu vào form
                console.log(response);
                $('#txtEmployeeCode').val(response.EmployeeCode);
                $('#txtEmployeeName').val(response.EmployeeName);
                if (response.DateOfBirth != null) {
                    $('#dtDateOfBirth').val(response.DateOfBirth.substring(0, 10));
                }

                $('#numIdentityNumber').val(response.IdentityNumber);
                if (response.IdentityDate != null) {
                    $('#dtIdentityDate').val(response.IdentityDate.substring(0, 10));
                }
                $('#txtEmployeePosition').val(response.EmployeePosition);
                $('#txtIdentityPlace').val(response.IdentityPlace);
                $('#txtAddress').val(response.Address);
                $('#txtPhoneNumber').val(response.PhoneNumber);
                $('#txtEmail').val(response.Email);
                $('#txtBankAccountNumber').val(response.BankAccountNumber);
                $('#txtBankName').val(response.BankName);
                $('#txtBankBranchName').val(response.BankBranchName);
                $('#DepartmentName').val(response.DepartmentName);
                const num = response.Gender;
                if (num == 1) {
                    document.getElementById("radio-nam").checked = true;
                } else if (num == 0) {
                    document.getElementById("radio-nu").checked = true;
                } else if (num == 2) {
                    document.getElementById("radio-khac").checked = true;
                } else {
                    document.getElementById("radio-nam").checked = false;
                    document.getElementById("radio-nu").checked = false;
                    document.getElementById("radio-khac").checked = false;
                }
                // Hiển thị
                $('#dlgPopup').show();
            }
        });
    }


    /**
     * Thêm mới nhân viên
     */
    btnAddEmloyee() {
        // Clean giá trị nhập
        $("input").val(null);
        // Bỏ lỗi đỏ và bỏ checked gender
        document.getElementById("txtEmployeeCode").classList.remove("h-input-warning");
        document.getElementById("txtEmployeeName").classList.remove("h-input-warning");
        document.getElementById("cbxDepartmentId").classList.remove("h-input-warning");
        document.getElementById("radio-nam").checked = false;
        document.getElementById("radio-nu").checked = false;
        document.getElementById("radio-khac").checked = false;
        // Gán giá trị FormMode
        this.FormMode = Enum.FormMode.Add;

        // Load mã nhân viên mới
        $.ajax({
            type: "GET",
            url: "http://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function(response) {
                //chưa có viết =))
                $('#txtEmployeeCode').val(response);
                // Focus vào ô mã nhân viên
                $('#txtEmployeeCode').focus();
            }
        });

        // Hiện dialog popup 
        $('#dlgPopup').show();
    }


    /**
     * Lưu thông tin nhân viên mới
     */
    btnSaveEmployee() {
        var self = this;
        // Lấy dữ liệu từ form
        //debugger
        const employeeCode = $('#txtEmployeeCode').val();

        const employeeName = $('#txtEmployeeName').val();

        const dateOfBirth = $('#dtDateOfBirth').val();


        var sex = $("input[name='gender']:checked").attr('id');
        const gender = (sex == "radio-nam" ? 1 : (sex == "radio-nu" ? 0 : 2));
        const departmentId = $('#cbxDepartmentId').data('value');
        const identityNumber = $('#numIdentityNumber').val();
        const identityDate = $('#dtIdentityDate').val();

        const employeePosition = $('#txtEmployeePosition').val();
        const identityPlace = $('#txtIdentityPlace').val();
        const address = $('#txtAddress').val();
        const phoneNumber = $('#txtPhoneNumber').val();
        const email = $('#txtEmail').val();
        const bankAccountNumber = $('#txtBankAccountNumber').val();
        const bankName = $('#txtBankName').val();
        const bankBranchName = $('#txtBankBranchName').val();
        // Build thành object

        let employee = {
                "EmployeeCode": employeeCode,
                "EmployeeName": employeeName,
                "DateOfBirth": dateOfBirth,
                "DepartmentId": departmentId,
                "IdentityNumber": identityNumber,
                "IdentityDate": identityDate,
                "EmployeePosition": employeePosition,
                "IdentityPlace": identityPlace,
                "Address": address,
                "PhoneNumber": phoneNumber,
                "Email": email,
                "BankAccountNumber": bankAccountNumber,
                "BankName": bankName,
                "BankBranchName": bankBranchName,
                "Gender": gender
            }
            // if (employeeCode != "" & employeeName != "" && departmentId != null) {
            // Gọi API để lưu
        if (this.FormMode == Enum.FormMode.Add) {
            $.ajax({
                type: "POST",
                url: "http://amis.manhnv.net/api/v1/Employees",
                data: JSON.stringify(employee),
                dataType: "json",
                async: false,
                contentType: "application/json",
                success: function(response) {
                    // Load lại dữ liệu
                    self.loadData();
                    // Ẩn form chi tiết
                    $('#dlgPopup').hide();
                    // console.log(response);
                },
                error: function(res) {
                    if (res.status == 400) {
                        switch (res.responseJSON.devMsg) {
                            case "Mã khách hàng đã tồn tại trong hệ thống.":
                                $('#PopupWarning').show();
                                break;
                            case "Mã khách hàng không được phép để trống":
                                alert(res.responseJSON.devMsg);
                                document.getElementById("txtEmployeeCode").classList.add("h-input-warning");
                                if (employeeName == "") {
                                    document.getElementById("txtEmployeeName").classList.add("h-input-warning");
                                }
                                if (departmentId == null) {
                                    document.getElementById("cbxDepartmentId").classList.add("h-input-warning");
                                }
                                break;
                            case "Tên nhân viên không được phép để trống.":
                                alert(res.responseJSON.devMsg);
                                if (departmentId == null) {
                                    document.getElementById("cbxDepartmentId").classList.add("h-input-warning");
                                }
                                document.getElementById("txtEmployeeName").classList.add("h-input-warning");
                                break;

                            case "Thông tin đơn vị của nhân viên không được phép trống.":
                                alert(res.responseJSON.devMsg);
                                document.getElementById("cbxDepartmentId").classList.add("h-input-warning");
                                break;
                            default:
                                alert("Đã có lỗi xảy ra");
                        }
                        $('#txtEmployeeCode').click(function() {
                            document.getElementById("txtEmployeeCode").classList.remove("h-input-warning");
                        });
                        $('#txtEmployeeName').click(function() {
                            document.getElementById("txtEmployeeName").classList.remove("h-input-warning");
                        });
                        $('#cbxDepartmentId').click(function() {
                            document.getElementById("cbxDepartmentId").classList.remove("h-input-warning");
                        });

                    } else {
                        alert("Đã có lỗi xảy ra");
                    }
                }
            });
        } else {
            $.ajax({
                type: "PUT",
                url: `http://amis.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,
                data: JSON.stringify(employee),
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    // Load lại dữ liệu
                    self.loadData();
                    // Ẩn form 
                    $('#dlgPopup').hide();
                    console.log(response);
                },
                error: function(res) {
                    if (res.status == 400) {

                        switch (res.responseJSON.devMsg) {
                            case "Mã khách hàng đã tồn tại trong hệ thống.":
                                $('#PopupWarning').show();
                                break;
                            case "Mã khách hàng không được phép để trống":
                                alert(res.responseJSON.devMsg)
                                document.getElementById("txtEmployeeCode").classList.add("h-input-warning");
                                if (employeeName == "") {
                                    document.getElementById("txtEmployeeName").classList.add("h-input-warning");
                                }
                                if (departmentId == null) {
                                    document.getElementById("cbxDepartmentId").classList.add("h-input-warning");
                                }
                                break;
                            case "Tên nhân viên không được phép để trống.":
                                alert(res.responseJSON.devMsg)
                                if (departmentId == null) {
                                    document.getElementById("cbxDepartmentId").classList.add("h-input-warning");
                                }
                                document.getElementById("txtEmployeeName").classList.add("h-input-warning");
                                break;

                            case "Thông tin đơn vị của nhân viên không được phép trống.":
                                alert(res.responseJSON.devMsg)
                                document.getElementById("DepartmentName").classList.add("h-input-warning");
                                break;
                            default:
                                alert("Đã có lỗi xảy ra");
                        }
                        $('#txtEmployeeCode').click(function() {
                            document.getElementById("txtEmployeeCode").classList.remove("h-input-warning");
                        });
                        $('#txtEmployeeName').click(function() {
                            document.getElementById("txtEmployeeName").classList.remove("h-input-warning");
                        });
                        $('#cbxDepartmentId').click(function() {
                            document.getElementById("cbxDepartmentId").classList.remove("h-input-warning");
                        });

                    } else {
                        alert("Đã có lỗi xảy ra");
                    }
                }
            });
        }
    }


    /**
     * Ẩn form thêm mới nhân viên
     */
    btnCloseOnClick() {
        $('#dlgPopup').hide();
    }


}