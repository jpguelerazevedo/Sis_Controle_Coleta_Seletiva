SELECT id_cargo,
       nome_cargo,
       descricao,
       hierarquia,
       salario,
       created_at,
       updated_at
FROM public.cargos
LIMIT 1000;