update thing 
    set that = $2, theOther $3
    where id = $1
    
    returning *;