import cron from 'node-cron';
import axios from 'axios';

const keepAlive = () => {
    cron.schedule('*/3 * * * *', () => {
        axios.get('https://kalpixbay.onrender.com')
            .then(response => {
                console.log('Ping successful:', response.status);
            })
            .catch(error => {
                console.error('Ping failed:', error.message);
            });
    });
};

export default keepAlive;
