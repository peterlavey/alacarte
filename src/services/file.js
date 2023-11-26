import axios from "axios";

const save = async data => {
    try {
        return await axios.post('http://localhost:3001', data);
    } catch (error) {
        console.error(error);
    }
};

const read = async () => {
    try {
        return await axios.get('http://localhost:3001');
    } catch (error) {
        console.error(error);
    }
};

export {
    save,
    read
};