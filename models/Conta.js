const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const Conta = new Schema({
	descricao:{
		type: String,
		require: true
	},
	data:{
		type: Date,
        require: true,
        default: Date.now()
    },
    vencimento:{
		type: Date,
        require: true,
        default: Date.now()
    },	
    pagamento:{
		type: Date,
        require: true
	},
	valor:{
		type: Number,
		require: true
	},
	grupoConta:{
		type: Schema.Types.ObjectId,
        ref: "grupos_contas",
        require: true
    },

    status:{
		type: String,
		require: true,
	},
	usuario:{
		type: Schema.Types.ObjectId,
        ref: "usuarios",
        require: true
    }

})

mongoose.model("contas", Conta);