
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const GrupoConta = new Schema({
	descricao:{
		type: String,
		require: true
	},
	data:{
		type: Date,
        require: true,
        default: Date.now()
	},
	tipo:{
		type: String,
		require: true
	},
	usuario:{
		type: Schema.Types.ObjectId,
        ref: "usuarios",
        require: true
    },
})

mongoose.model("grupos_contas", GrupoConta);