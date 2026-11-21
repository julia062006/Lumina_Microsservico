import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class LivroCadastradoEvent {
  @IsInt()
  @Min(1)
  id_livro: number;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  capa_imagem?: string;

  @IsString()
  autor: string;

  @IsString()
  editora: string;
}