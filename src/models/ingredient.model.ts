export enum IngredientUnity {
    CENTILITRE = "CENTILITRE",
    MILLILITRE = "MILLILITRE"
}

export class Ingredient {
    _id: string
    name: string
    unity: IngredientUnity
    value?: number

    constructor(_id: string, name: string, unity: IngredientUnity = IngredientUnity.CENTILITRE, value?: number) {
        this._id = _id
        this.name = name
        this.unity = unity
        this.value = value
    }
}