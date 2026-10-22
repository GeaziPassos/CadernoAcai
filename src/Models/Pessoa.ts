class Pessoa{
    private _id: number |undefined
    private _nome: string 
    private _duplaID: number | undefined

    constructor(nome: string, id?: number, duplaID?: number){
        this._nome = nome;
        this._duplaID = duplaID;
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
            return this._duplaID;
    }

//Setters
    set nome(nome: string){
        this._nome = nome;
    }

    set duplaID(duplaID: number){
        this._duplaID = duplaID
    }

    removeDupla(){
        this._duplaID = undefined;
    }
}

let pessoa = new Pessoa("geazi")

console.log(pessoa.nome)