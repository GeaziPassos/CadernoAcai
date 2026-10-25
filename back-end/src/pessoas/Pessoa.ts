class Pessoa{
    private _id: number |undefined
    private _nome: string 
    private _dupla_id: number | undefined

    constructor(nome: string, id?: number, duplaID?: number){
        this._nome = nome;
        this._dupla_id = duplaID;
        this._id = id;
    }

//Getters
    get id(): number | undefined{
        return this._id;
    }

    get nome(){
        return this._nome;
    }

    get duplaID(): number | undefined{
            return this._dupla_id;
    }

//Setters
    set nome(nome: string){
        this._nome = nome;
    }

    set duplaID(duplaID: number){
        this._dupla_id = duplaID
    }

    removeDupla(){
        this._dupla_id = undefined;
    }
}

let pessoa = new Pessoa("geazi")

console.log(pessoa.nome)