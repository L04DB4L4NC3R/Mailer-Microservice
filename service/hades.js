Axios=require('axios');


module.exports={
    getPart:  (event,type) => {
        return new Promise(async (resolve,reject) => {
            try{
                emails=[]
                response=await Axios.post(`${process.env.BASEURL}api/v1/simple-projection/project-${type}`, {event})
                response.data.rs.forEach(element => {
                    emails.push({email:element.email,name:element.name})
                });
                resolve(emails)
            } catch(e){ 
                reject(e.response.data.error)
            }
        })
        
    }
}
