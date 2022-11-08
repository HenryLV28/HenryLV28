function actualizaCacheDinamico(dynamicCache, req, res){
    if (req.ok){
        return caches.open(dynamicCache).then(cache=>{
            cache.put(req, res.clone());
            return res.clone();
        });
    }else{
        return res;
    }
}