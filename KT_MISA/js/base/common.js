class CommonJS {
    /**
     * Định dạng ngày tháng năm
     */
    static formatDate(date) {
        if (date) {
            const newDate = new Date(date);
            let day = newDate.getDate();
            let month = newDate.getMonth() + 1;
            let year = newDate.getFullYear();
            day = (day < 10) ? `0${day}` : day;
            month = (month < 10) ? `0${month}` : month;
            return `${day}/${month}/${year}`;
        } else {
            return "";
        }
    }

    static formatData(data) {
        if (data != null) {
            return data;
        } else {
            return "";
        }
    }

    static departmentName(data) {
        $.ajax({
            type: "GET",
            url: `http://amis.manhnv.net/api/v1/Departments/${data}`,
            success: function(response) {
                console.log(response.DepartmentName);
                return response.DepartmentName;

            }
        });
    }
}