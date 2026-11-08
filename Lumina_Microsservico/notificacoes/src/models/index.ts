import Notificacao from "./notificacao.model";
import EntregaNotificacao from "./entrega-notificacao.model";

Notificacao.hasMany(EntregaNotificacao, {
foreignKey: "notificacao_id",
  as: "entregas",
  onDelete: "CASCADE",
});
EntregaNotificacao.belongsTo(Notificacao, {
  foreignKey: "notificacao_id",
  as: "notificacao",
});

export { Notificacao, EntregaNotificacao };