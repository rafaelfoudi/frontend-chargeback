import { HttpInterceptorFn } from '@angular/common/http';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = 'minha-chave-secreta-123';

  // Clona a requisição adicionando o cabeçalho X-API-KEY
  const authReq = req.clone({
    headers: req.headers.set('X-API-KEY', apiKey)
  });

  return next(authReq);
};