package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.RestaurantTableCreateDTO;
import com.emirhan.day3.springboot.dto.RestaurantTableDTO;
import com.emirhan.day3.springboot.model.RestaurantTable;
import com.emirhan.day3.springboot.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantTableService {
    private final RestaurantTableRepository restaurantTableRepository;

    public RestaurantTableService(RestaurantTableRepository restaurantTableRepository) {
        this.restaurantTableRepository = restaurantTableRepository;
    }
    private RestaurantTableDTO convertToDTO(RestaurantTable restaurantTable) {
        return new RestaurantTableDTO(
                restaurantTable.getId(),
                restaurantTable.getTableNumber(),
                restaurantTable.getCapacity(),
                restaurantTable.isAvailable(),
                restaurantTable.getTableType(),
                restaurantTable.getLocation()
        );
    }

    private RestaurantTable convertToRestaurantTable(RestaurantTableCreateDTO dto) {

        RestaurantTable table = new RestaurantTable();

        table.setTableNumber(dto.getTableNumber());
        table.setCapacity(dto.getCapacity());
        table.setTableType(dto.getTableType());
        table.setLocation(dto.getLocation());

        table.setAvailable(true);

        return table;
    }

    public List<RestaurantTableDTO> getAllRestaurantTable()
    {
        List<RestaurantTable> restaurantTables = restaurantTableRepository.findAll();
        List<RestaurantTableDTO> restaurantTableDTOList = new ArrayList<>();
        for (RestaurantTable restaurantTable:restaurantTables){
            RestaurantTableDTO dto = convertToDTO(restaurantTable);
            restaurantTableDTOList.add(dto);
        }
        return restaurantTableDTOList;
    }

    public RestaurantTableDTO addRestaurantTable(RestaurantTableCreateDTO dto){
        RestaurantTable restaurantTable = convertToRestaurantTable(dto);
        RestaurantTable savedRestaurantTable = restaurantTableRepository.save(restaurantTable);
        RestaurantTableDTO restaurantTableDTO = convertToDTO(savedRestaurantTable);
        return  restaurantTableDTO;
    }

    public RestaurantTableDTO getByIdTable(Long id){
            RestaurantTable restaurantTable = restaurantTableRepository.findById(id).orElseThrow();
            return convertToDTO(restaurantTable);
    }

    public void deleteTable(Long id){
         restaurantTableRepository.deleteById(id);
    }

    public RestaurantTableDTO updateRestaurantTable(Long id,RestaurantTableCreateDTO dto){
        RestaurantTable restaurantTable = restaurantTableRepository.findById(id).orElseThrow();

        restaurantTable.setTableNumber(dto.getTableNumber());
        restaurantTable.setCapacity(dto.getCapacity());
        restaurantTable.setTableType(dto.getTableType());
        restaurantTable.setLocation(dto.getLocation());

        RestaurantTable updatedTable = restaurantTableRepository.save(restaurantTable);
        return convertToDTO(updatedTable);

    }
}
