$(document).ready(function() {
    // Khởi tạo  sự kiện cho button của combobox
    $('.hcombobox .h-combobox-button').click(btnComboboxOnClick);
    // $('.hcombobox .h-combobox-item').click(itemComboboxOnClick);
    $('.hcombobox').on('click', '.h-combobox-item', itemComboboxOnClick)

    $('.hcombobox input').keydown(inputComboboxOnKeyDown);
    $('.hcombobox input').keyup(inputComboboxOnKeyUp);

    // Lưu trữ thông tin của combobox data
    let comboboxs = $('.hcombobox');
    for (const combobox of comboboxs) {
        let itemDataElements = $(combobox).find('.h-combobox-data').html();

        $(combobox).data('itemDataElement', itemDataElements);
        $(combobox).find('.h-combobox-data').empty();
    }
})

function inputComboboxOnKeyUp() {
    // Loại bỏ 1 số phím đặc biệt
    switch (event.keyCode) {
        case 13:
        case 40:
        case 38:
            break;

        default:
            $(this).siblings('.h-combobox-data').empty();
            let itemDataElement = $(this.parentElement).data('itemDataElement');
            // Build lại html cho combobox
            $(this).siblings('.h-combobox-data').html(itemDataElement);
            // Thực hiện lọc dữ liệu trong combobox data items
            // 1. Lấy value đã nhập trên input
            const valueInput = this.value;
            // 2. Duyệt từng item và thực hiện kiểm tra xem trùng không

            // Lấy tất cả item của combobox
            let items = $(this).siblings('.h-combobox-data').children();
            for (const item of items) {
                let text = item.textContent;
                if (!text.toLowerCase().includes(valueInput.toLowerCase())) {
                    item.remove();
                }
            }
            $(this).siblings('.h-combobox-data').show();

            break;
    }

}

function inputComboboxOnKeyDown() {

    // Lấy tất cả item của combobox
    let items = $(this).siblings('.h-combobox-data').children();

    // Kiểm tra xem có item nào ở trạng thái hover chưa
    let itemHoverred = items.filter('.h-combobox-item-hover');

    // Bỏ hover các item đã xét
    // $(items).removeClass('h-combobox-item-hover');

    switch (event.keyCode) {
        case 13: // Nhấn enter
            // Nếu có item nào đó được chọn thì lấy text -> gán cho input
            if (itemHoverred.length == 1) {
                // Lấy HTML element
                itemHoverred = itemHoverred[0]
                let text = itemHoverred.textContent;
                let value = itemHoverred.getAttribute('value');
                // Gán text vào input của combobox
                // Lấy ra element cha
                let parentElement = itemHoverred.parentElement;
                // Tìm element input ngang cấp với element cha và gán text
                $(parentElement).siblings('input').val(text);

                // Gán value cho combobox
                // Tìm element combobox chứa item hiện tại
                let parentComboboxElement = $(itemHoverred).parents('.hcombobox');
                // Cách 1 
                // parentComboboxElement.attr('value', value);

                // Cách 2 - gán vào data của element
                parentComboboxElement.data('value', value);

                // Ẩn combobox data đi
                $(parentElement).hide();
            }
            break;
        case 40: // Nhấn phím mũi xuống lên
            // Nếu đã có item được hover trước đó thì hover tới item kế tiếp

            if (itemHoverred.length > 0) {
                // Lấy item kế tiếp
                let nextElement = itemHoverred.next();
                // Thêm class hover cho item kế tiếp
                nextElement.addClass('h-combobox-item-hover');
                // Xóa item hiện tại
                itemHoverred.removeClass('h-combobox-item-hover');
            } else {
                // Nếu không có thì mặc định focus vào item đầu tiên
                // Chọn item đầu tiên
                let firstItem = items[0];
                firstItem.classList.add('h-combobox-item-hover');
            }
            // Hiển thị data của combobox
            $(this).siblings('.h-combobox-data').show();

            break;
        case 38: // Nhấn vào mũi tên lên
            // Nếu đã có item được hover trước đó thì hover tới item kế tiếp

            if (itemHoverred.length > 0) {
                // Lấy item kế tiếp
                let prevElement = itemHoverred.prev();
                // Thêm class hover cho item kế tiếp
                prevElement.addClass('h-combobox-item-hover');
                // Xóa item hiện tại
                itemHoverred.removeClass('h-combobox-item-hover');
            } else {
                // Chọn item cuối
                let lastItem = items[items.length - 1];
                lastItem.classList.add('h-combobox-item-hover');
            }
            // Hiển thị data của combobox
            $(this).siblings('.h-combobox-data').show();

            break;
        default:
            break;
    }

}

function btnComboboxOnClick() {
    // Hiển thị combobox data của chính combobox hiện tại
    // 1. xác định combobox data của combobox hiện tại
    let comboboxData = $(this).siblings('.h-combobox-data');
    // 2. Hiển thị
    comboboxData.toggle();
}

function itemComboboxOnClick() {
    // Hiển thị text ở item vừa chọn lên input của combobox
    // 1. Lấy text trong item vừa chọn
    const text = this.textContent;

    // 2. Lấy ra value của item vừa chọn
    const value = this.getAttribute('value');

    // 3. Gán text vào input của combobox
    // 3.1 Lấy ra element cha
    let parentElement = this.parentElement;
    // 3.2 Tìm element input ngang cấp với element cha và gán text
    $(parentElement).siblings('input').val(text);

    // 4. Gán value cho combobox
    // 4.1 Tìm element combobox chứa item hiện tại
    let parentComboboxElement = $(this).parents('.hcombobox');
    // Cách 1 
    // parentComboboxElement.attr('value', value);

    // Cách 2 - gán vào data của element
    parentComboboxElement.data('value', value);

    // Ẩn combobox data đi
    $(parentElement).hide();
}