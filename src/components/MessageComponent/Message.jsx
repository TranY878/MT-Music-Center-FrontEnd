import { message } from "antd";

const success = (mes = 'Thành công!') => {
    message.success(mes, 5);
};

const error = (mes = 'Đã xảy ra lỗi!') => {
    message.error(mes, 5);
};

const warning = (mes = 'Cảnh báo!!!') => {
    message.warning(mes, 5);
};

const application = (mes = 'Thông báo!') => {
    message.info(mes, 5)
}

export { success, error, warning, application }