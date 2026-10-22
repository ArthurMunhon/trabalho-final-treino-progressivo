import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import AlunosService from './alunos.service.js';
import { CreateAlunoDto } from './dto/create-aluno.dto.js';
import { UpdateAlunoDto } from './dto/update-aluno.dto.js';
import { QueryAlunoDto } from './dto/query-aluno.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import {
  Perfis,
  UsuarioLogado,
  type UsuarioDoToken,
} from '../auth/usuario-logado.decorator.js';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Get()
  @UseGuards(JwtAuthGuard) // Exige token valido
  @Perfis('personal') // aluno recebe 403 (contrato, 3.3)
  findAll(
    @Query() query: QueryAlunoDto,
    @UsuarioLogado() usuario: UsuarioDoToken, // Personal logado vem do token
  ) {
    return this.alunosService.findAll(query, usuario.id); // Lista so os alunos dele
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alunosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard) // Protege para exigir que o personal esteja logado
  @Perfis('personal') // aluno recebe 403 (contrato, 3.3)
  create(
    @Body() dto: CreateAlunoDto,
    @UsuarioLogado() usuario: UsuarioDoToken, // Pega o ID do personal direto do token JWT
  ) {
    return this.alunosService.create(dto, usuario.id); // Envia o ID para o service salvar o vínculo
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlunoDto) {
    return this.alunosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.alunosService.remove(id);
  }
}
