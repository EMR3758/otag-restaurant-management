package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.RestaurantTableCreateDTO;
import com.emirhan.day3.springboot.dto.RestaurantTableDTO;
import com.emirhan.day3.springboot.service.RestaurantTableService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tables")
public class RestaurantTableController {

    private final RestaurantTableService restaurantTableService;

    public RestaurantTableController(RestaurantTableService restaurantTableService) {
        this.restaurantTableService = restaurantTableService;
    }

    @GetMapping
    public List<RestaurantTableDTO> getAllRestaurantTables() {
        return restaurantTableService.getAllRestaurantTable();
    }

    @PostMapping
    public RestaurantTableDTO createRestaurantTable(@RequestBody RestaurantTableCreateDTO dto) {
        return restaurantTableService.addRestaurantTable(dto);
    }

    @GetMapping("/{id}")
    public RestaurantTableDTO getByIdRestaurantTable(@PathVariable Long id) {
        return restaurantTableService.getByIdTable(id);
    }

    @PutMapping("/{id}")
    public RestaurantTableDTO updateRestaurantTable(@PathVariable Long id,
                                                    @RequestBody RestaurantTableCreateDTO dto) {
        return restaurantTableService.updateRestaurantTable(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteRestaurantTable(@PathVariable Long id) {
        restaurantTableService.deleteTable(id);
    }
}