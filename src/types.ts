type Item = {
    
    id : number;
    text : string;
    checked : boolean;

}

type User = {

    name : string;
    pass : string;
    items : Item[];

}

export { Item, User }