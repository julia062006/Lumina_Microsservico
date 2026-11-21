export interface NovoLivroTemplateData {
  titulo: string;
  autor: string;
  editora: string;
  descricao?: string;
  temCapa: boolean;
  link: string;
}

function esc(texto?: string): string {
  return (texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function novoLivroTemplate(d: NovoLivroTemplateData): string {
  const descricao = d.descricao && d.descricao.length > 300
    ? d.descricao.slice(0, 300).trimEnd() + '...'
    : d.descricao ?? '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Novo livro na Lumina</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#333333;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:760px;background-color:#ffffff;">

          <tr>
            <td style="padding:28px 40px;border-bottom:1px solid #eeeeee;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:27px;letter-spacing:2px;color:#7655a6;">LUMINA</span>
            </td>
          </tr>

          <tr>
            <td style="padding:35px 40px 15px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:normal;color:#333333;">
                Temos um novo livro!
              </h1>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#777777;">
                Um novo título acaba de chegar à biblioteca da Lumina. Confira os detalhes abaixo.
              </p>
            </td>
          </tr>

          ${d.temCapa ? `
          <tr>
            <td align="center" style="padding:25px 40px 15px;">
              <img src="cid:capa-livro" alt="Capa de ${esc(d.titulo)}" width="190" style="display:block;width:190px;max-width:100%;height:auto;border:1px solid #eeeeee;" />
            </td>
          </tr>
          ` : ''}

          <tr>
            <td style="padding:20px 40px 10px;">
              <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:25px;font-weight:normal;line-height:1.4;color:#7655a6;">
                ${esc(d.titulo)}
              </h2>
              <p style="margin:12px 0 5px;font-size:15px;color:#555555;">
                <strong>Autor:</strong> ${esc(d.autor)}
              </p>
              <p style="margin:5px 0;font-size:15px;color:#555555;">
                <strong>Editora:</strong> ${esc(d.editora)}
              </p>
            </td>
          </tr>

          ${descricao ? `
          <tr>
            <td style="padding:20px 40px 10px;">
              <p style="margin:0 0 10px;font-size:15px;font-weight:bold;color:#444444;">Sobre o livro</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#777777;">
                ${esc(descricao)}
              </p>
            </td>
          </tr>
          ` : ''}

          <tr>
            <td style="padding:35px 40px 40px;">
              <a href="${esc(d.link)}" target="_blank" style="display:inline-block;padding:14px 28px;background-color:#7655a6;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">
                Ver livro na Lumina
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:25px 40px;background-color:#fafafa;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#7655a6;">Lumina</p>
              <p style="margin:8px 0 0;font-size:12px;line-height:1.6;color:#999999;">
                Você recebeu este e-mail porque possui cadastro na plataforma Lumina.
                <br />
                © ${new Date().getFullYear()} Lumina.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
