var filters = [
     {
        key: "all",
        title: "Усі",
        filter: function(pizza){
            return true;
        },
    },

     {
        key: "meat",
        title: "М'ясні",
        filter: function(pizza){
            return "meat" in pizza.content;
        },
    },

    {
        key: "pineapple",
        title: "З ананасами",
        filter: function(pizza){
            return "pineapple" in pizza.content;
        },
    },

    {
        key: "mushroom",
        title: "З грибами",
        filter: function(pizza){
            return "mushroom" in pizza.content;
        },
    },

    {
        key: "ocean",
        title: "З морепродуктами",
        filter: function(pizza){
            return "ocean" in pizza.content;
        },
    },

    {
        key: "vega",
        title: "Вега",
        filter: function(pizza){
            return !("meat" in pizza.content || "ocean" in pizza.content || "chicken" in pizza.content);
        },
    }


];

module.exports = filters;
