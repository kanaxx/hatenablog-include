class HatenaDynamicInclude{
    //set your environment
    microCms = {
        endpoint:'https://-yourdomain-.microcms.io/api/v1/-yoursetting-/',
        apiKey : 'your key',
    };
    
    contentsId = '';
    elementId = '';
    data = null;

    constructor(contentsId, elementId) {
        this.contentsId = contentsId;
        if(!elementId.startsWith('#')){
            this.elementId = '#' + elementId;
        }else{
            this.elementId = elementId;
        }
    }
    
    async fetch(){
        let config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-API-KEY': this.microCms.apiKey,
            },
            method: "GET"
        };
    
        let url = this.microCms.endpoint + this.contentsId;
        let response = await fetch(url, config);
        if( response.status != 200){
            console.error('microCMS returns status %s, %s',response.status, this.contentsId);
            return;
        }
        this.data = await response.json();
        // console.log(this.data);
        console.info('%s|end of fetch', this.constructor.name);
    }

    write(){
        if(!this.data){
            console.log('%s is not defined in microcms', this.contentsId);
            return null;
        }
        let div = document.querySelector(this.elementId);
        if(!div){
            console.log('%s is not defined in this article', this.elementId);
            return null;
        }
        Object.keys(this.data).forEach(function (key) {
            let selector = this.elementId + '-' + key;
            console.log(selector);
            let target = div.querySelector(selector);
            if(target){
                target.innerHTML = `
                    <!--${this.constructor.name}-->
                    ${this.data[key]}
                    <!--${this.constructor.name}-->`;
                console.log('done %s', key);
            }else{
                console.log('skip %s', key);
            }
        },this);
        console.info('%s|end of write', this.constructor.name);
    }
    ready(){
        let div = document.querySelector(this.elementId);
        return (div!=null);
    }
    async include(){
        if(this.ready()){
            await this.fetch();
            this.write();
        }
        console.info('%s|end of execute', this.constructor.name);
    }
}
