import axios from 'axios';
import { Button, notification, Result } from 'antd';

export const data = async () => {
    const api = 'https://reqres.in/api/users?page=2';
    const result =  await axios.get(api);
    return result.data;
};

export const create = async (data) => {
    const api = 'https://reqres.in/api/users';
    const result =  await axios.post(api, data);
    return result.data;
}

export const login = async (data) => {
    const api = 'https://reqres.in/api/login';
    const result =  await axios.post(api, data);
    return result;
}

const main = axios.create({
    baseURL: 'http://98.80.114.52:8080/',
    headers: {
        'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo4MDgwIiwidXBuIjoidGVzdGFkbWluQHlvcG1haWwuY29tIiwidXNlcklkIjoxLCJlbWFpbCI6InRlc3RhZG1pbkB5b3BtYWlsLmNvbSIsImV4cCI6MTc0MTI2Mzc4MzY3MywiZ3JvdXBzIjpbIlVTRVIiXSwiaWF0IjoxNzQxMjYwMTgzLCJqdGkiOiI5MzIzOTYyNi01NDY0LTRlYzQtOWMwOS05YzVkNGY0ODM2MTAifQ.Wp06CklbtkIFD3pSKOrtmPIDEyOgtoTJPbQbm6yMwDq6ugBmIM16Oti4jZQOwOsj13wXYKhOGFQ7L3dVJkhXNOtnCXfMvtBZBXkJSQKFYaz2u8muJeBHzy5QWuaEkyFxbzkBHvksV31pjHg39Qywf9A3o-1w9Bo8XIsl2BYOojT8V9nv4crLt46qsFqkXj7dmsghQ0IvIA4uZ-WvVaeceLMz4natSGG9LPkj-08jCq7hhIQz4gzEmKU1EhkRJLlUG7CPAZ-9REV7RbplIWY1gXmycq3HrHeiBuGfB37gooNHZYIIrFfIgtSxdmVb-kU_2FRaNRpKGzF53cTvcvpQ2A'
    }
});

const handleErrors = (error) => {
    const errorMessage = (error) => {
        notification.error({
            message: error,
            placement: "topRight"
        });
    }
    if (error.response) {
        errorMessage(error.response.data.message);
    } else if (error.request) {
        errorMessage("Please check your internet connection.");
    } else {
        errorMessage("An unexpected error occurred.");
    }
};

export const getList = async (page) => {
    try {
        const api = `user/list?pageIndex=${page.pageIndex}&pageSize=${page.pageSize}`;
        const result = await main.get(api);
        return result;
    } catch (error) {
        handleErrors(error);
        throw (error);
    }
}

export const createUser = async (payload) => {
    try {
        const api = 'user';
        const result = await main.post(api, payload);
        return result;
    } catch (error) {
        handleErrors(error);
        return null;
    }
}

export const updateUser = async (payload) => {
    const api = 'user';
    const result = await main.put(api, payload);
    return result;
}

export const deleteUser = async (id) => {
    const api = 'user';
    const result = await main.delete(`${api}/${id}`);
    return result;
}