package com.security.Spring.security.JWT.service;
import com.security.Spring.security.JWT.dto.ReqRes;
import com.security.Spring.security.JWT.entity.OurUsers;
import com.security.Spring.security.JWT.repository.OurUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private OurUserRepository ourUserRepository;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;

    public ReqRes signUp(ReqRes registrationRequest){
        ReqRes resp = new ReqRes();
        try {
            // Verificar si algún campo requerido es nulo
            if (registrationRequest.getName().length() == 0 || registrationRequest.getLastname().length() == 0 ||
                    registrationRequest.getEmail().length() == 0 || registrationRequest.getPassword().length() == 0 ||
                    registrationRequest.getRole().length() == 0) {
                resp.setStatusCode(400);  // Código de estado HTTP para solicitud incorrecta
                resp.setError("Completa todos los campos requeridos.");
                return resp;
            }

            // Verificar si el correo electrónico ya está registrado
            if (ourUserRepository.findByEmail(registrationRequest.getEmail()).isPresent()) {
                resp.setStatusCode(409);  // Código de estado HTTP para solicitud incorrecta
                resp.setError("El correo electrónico ya está registrado.");
                return resp;
            }

            OurUsers ourUsers = new OurUsers();
            ourUsers.setName(registrationRequest.getName());
            ourUsers.setLastname(registrationRequest.getLastname());
            ourUsers.setEmail(registrationRequest.getEmail());
            ourUsers.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            ourUsers.setRole(registrationRequest.getRole());
            OurUsers ourUserResult = ourUserRepository.save(ourUsers);

            if (ourUserResult != null && ourUserResult.getId() > 0) {
                resp.setOurUsers(ourUserResult);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqRes signIn(ReqRes signinRequest){
        ReqRes response = new ReqRes();
        try {
            // Intenta autenticar al usuario
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getPassword()));

            // Busca al usuario por el correo electrónico
            Optional<OurUsers> userOptional = ourUserRepository.findByEmail(signinRequest.getEmail());

            if (userOptional.isPresent()) {
                // Usuario encontrado en la base de datos
                OurUsers user = userOptional.get();
                System.out.println("USER IS: " + user);

                // Genera el token y el refresh token
                var jwt = jwtUtils.generateToken(user);
                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

                // Configura la respuesta exitosa
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshToken);
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Signed In");
            } else {
                // Usuario no encontrado en la base de datos
                response.setStatusCode(404);
                response.setError("User not found");
            }
        } catch (BadCredentialsException e) {
            // Usuario y/o contraseña inválidos
            response.setStatusCode(401);
            response.setError("Invalid username and/or password");
        } catch (Exception e) {
            // Otro error (por ejemplo, error interno del servidor)
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    public ReqRes refreshToken(ReqRes refreshTokenReqiest){
        ReqRes response = new ReqRes();
        String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
        OurUsers users = ourUserRepository.findByEmail(ourEmail).orElseThrow();
        if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
            var jwt = jwtUtils.generateToken(users);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshTokenReqiest.getToken());
            response.setExpirationTime("24Hr");
            response.setMessage("Successfully Refreshed Token");
        }
        response.setStatusCode(500);
        return response;
    }
}
