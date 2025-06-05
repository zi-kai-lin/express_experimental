const { client } = require("../config/redis");


const cacheGet = async(key) => { 

    try{ 
        if(!client.isOpen) return null;
        const result = await client.get(key); 
        return result ? JSON.parse(result) : null;



    }catch{
        /* Don't throw error, because app should still function without redis
        just return null
        */
        console.error('Cache get error:', error);
        return null; // Fail gracefully

    }

}
const cacheSet = async (key, data, ttlSeconds = 300) => {
    try {
        if (!client.isOpen) return;
        await client.setEx(key, ttlSeconds, JSON.stringify(data));
    } catch (error) {
        console.error('Cache set error:', error);
        // Fail gracefully - don't throw
    }
};

const cacheDel = async (key) => {
    try {
        if (!client.isOpen) return;
        await client.del(key);
    } catch (error) {
        console.error('Cache delete error:', error);
    }
};

module.exports = {
    cacheGet,
    cacheSet,
    cacheDel
};