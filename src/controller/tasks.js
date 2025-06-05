const { pool } = require("../config/database")


/*     return jwt.sign({id :user.id, name: user.username, email: user.email}, secretKey, {expiresIn: expiration})
 */
const addTask = async(req, res) => {
    const connection = await pool.getConnection();
    /* get the user object */
    try{
        const body = req.body;

        const user_id = req.user.id;
        let content = body.content ? body.content : "";
        let date = body.date;
        
        
        if(!date){ 

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            date = `${year}-${month}-${day}`;    
    
        }
        await connection.beginTransaction();

        const [insertion] = await connection.execute(`
            
                INSERT INTO Tasks (user_id, content, due_date) VALUES (?, ?, ?);
            
        `, [user_id, content, date])

        

        await connection.commit();
        
        return res.status(201).json({

            message: "success",
            task: insertion.insertId



        });


    }
    catch(error){

        await connection.rollback();
        return res.status(400).json({

            error: "Insertion failed"
            

        })

    }
    finally{

        if(connection){

            await connection.release();

        }


    }
   

    



}



/* 
taskRouter.get("/all");

 */
const getAllTask = async(req, res) => {

    const connection = await pool.getConnection();
    try{

        const userId = req.user.id

        const [tasks] = await connection.execute(`
            
            SELECT * FROM Tasks WHERE user_id = ?
            
            
        `, [userId]);


        return res.status(200).json({


            message: "success",
            result: tasks


        })

        




    }catch(error){
        
        return res.status(400).json({

            message: "unable to obtain tasks"

        })

    }finally{
        if(connection){
            await connection.release();
        }

    }


}

/* taskRouter.get("/:taskId");  */

const getTask = async(req, res) => {
    const connection = await pool.getConnection();
    try{

        const taskId = req.params.taskId;
        const userId = req.user.id;
        
        const [result] = await connection.execute(`SELECT * FROM Tasks WHERE task_id = ? AND user_id = ?`, [taskId, userId]);

        if (result.length === 0) {
            return res.status(404).json({
                error: "Task not found",
                message: "No task exists with the provided ID"
            });
        }

        return res.status(200).json({


            message:"success",
            result: result[0]


        })
        



    }catch(error){
        
        return res.status(400).json({

            error : "unable to obtain task"


        })

    }finally{
        if(connection){
            await connection.release();
        }
        
    } 

}
/* taskRouter.post("/filteredSearch", ); */
const getTaskByDate = async(req, res) => {

    const connection = await pool.getConnection();
    let connectionReleased = false;
    try{

        const userId = req.user.id;
        const date = req.body.date;

        if(!date){

            await connection.release();
            connectionReleased = true;
            return getAllTask(req, res);

        }

        const [results] = await connection.execute(`select * from Tasks where user_id = ? AND due_date = ?`, [userId, date]);


        return res.status(200).json({

            message: "success",
            result: results


        })
        


    
    }catch(error){
        return res.status(400).json({

            error : "unable to obtain task"


        })

    
    }finally{
        if(connection && !connectionReleased){
            await connection.release();
        }
        
    }
    
}


/* taskRouter.get("/count") */
const getCount = async(req, res) => {

    const connection = await pool.getConnection();
    try{

        const userId = req.user.id;

        const [results] = await connection.execute(`Select COUNT(user_Id) AS count FROM Tasks WHERE user_id = ?`, [userId]);

        return res.status(200).json({

            message: "success",
            result: results[0]

        })


    }catch(error){
        return res.status(400).json({

            error : "unable to obtain count"


        })


    }finally{
        if(connection){
            await connection.release();
        }
        
    } 


}

const deleteTask = async(req, res) => {


    const connection = await pool.getConnection();
    try{

        const taskId = req.params.taskId;
        const userId = req.user.id;

        await connection.beginTransaction();

        const [results] = await connection.execute(`DELETE FROM Tasks WHERE user_id = ? AND task_id = ?`, [userId, taskId]);

        if(results.affectedRows === 0){

            return res.status(404).json({

                error: "task not found"


            })


        }else{
            await connection.commit();
            return res.status(200).json({
    
                message: `task id of ${taskId} deleted`
    
    
            })

        }





    }catch(error){
        await connection.rollback();
        return res.status(500).json({

            error: "task deletion failure"


        })

    }finally{
        if(connection){
            await connection.release();
        }
        
    }


}


/* 



taskRouter.patch("/:taskId");
 */
const update = async(req, res) =>{

    const connection = await pool.getConnection();
    try{
        const taskId = req.params.taskId;
        const userId = req.user.id;
        const content = req.body.content ? req.body.content : "";

        await connection.beginTransaction();


        const [results] = await connection.execute(`UPDATE Tasks SET content = ? Where user_id = ? AND task_id = ? `, [content, userId, taskId]);

        if(results.affectedRows === 0){

            return res.status(404).json({


                error: "Task not found"


            })



        }else{

            await connection.commit();

            return res.status(200).json({

                message: `task ${taskId} updated successfuly`,
                updatedContent: content


            })



        }

    
    }catch(error){
        await connection.rollback();
        return res.status(500).json({
            error: "Failed to update task",
        });
    
    }finally{
        if(connection){
            await connection.release();
        }
        
    } 

}


/* 
const connection = await pool.getConnection();
try{


}catch(error){
    

}finally{
    if(connection){
        await connection.release();
    }
    
} */

module.exports = {
    addTask,
    getTask,
    getAllTask,
    getTaskByDate,
    getCount,
    deleteTask,
    update
}

