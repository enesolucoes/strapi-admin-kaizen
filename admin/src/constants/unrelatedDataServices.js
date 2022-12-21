const SERVICES = {
  front_equipment: {
    url: "/content-manager/relations/api::frente.frente/equipamentos",
    query_column: "[frente][id]"
  },
  factory_front: {
    url: "/content-manager/relations/api::usina.usina/frentes",
    query_column: "[usina][id]"
  }
}

export { SERVICES };