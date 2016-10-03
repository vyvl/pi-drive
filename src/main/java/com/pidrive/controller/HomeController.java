package com.pidrive.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by SiddarthaPeteti on 9/12/2016.
 */
@Controller
public class HomeController {
    @RequestMapping(value = "/",method = RequestMethod.GET)
    public String homePage(){
        return "index.html";
    }

    @RequestMapping(value = "/register",method = RequestMethod.GET)
    public String loginPage(){
        return "index.html";
    }
}
