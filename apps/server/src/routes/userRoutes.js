import users from '../../testData.js';

const getUsers = (req, res) => {
    try {
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export default getUsers ;