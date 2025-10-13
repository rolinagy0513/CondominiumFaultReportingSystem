package org.example.condominiumfaultreportingsystem.apartment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Controller
@RequiredArgsConstructor
@RequestMapping("api/")
public class ApartmentController {

    private final ApartmentService apartmentService;



}
