<?php

// csv info file

csv_to_array('csvinfo.csv', ',');

/*
 Create an array with a csv
*/
function csv_to_array($filename='', $delimiter=',')
{

    if(!file_exists($filename) || !is_readable($filename))
        return FALSE;
    
    $header = NULL;
    $data = array();
    if (($handle = fopen($filename, 'r')) !== FALSE)
    {
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
        {
            // Get real Magento 2 CSV header
            $real_header = getFinalHeader();

            if(!$header){
                $header = $real_header;
                $data[] = $real_header;
            }else{

                $arrayRow = formatRowForMagento($row);
                    
                $data[] = array_combine($header, $arrayRow);
            }
        }
        fclose($handle);
    }

    //create a blank.csv file or another one
    return generateCsv($data,'blank.csv',',');
}

/*
 Generates a CSV file with array

*/
function generateCsv($data,$path, $delimiter = ';') {
       $handle = fopen($path, 'ab+');
       $last = count($data[0]);
       //$this->log('columnas: '.$last. ' | ');

       foreach ($data as $line) {
           fputcsv($handle,$line, $delimiter);
       }
       fclose($handle);
       chmod($path, 0777);
   }

/* 
 Create magento 2 default headers

*/
function getFinalHeader(){

    // Default Magento 2 CSV Fields 
    // If any field is missing feel free to add it
    $finalHeader = array(0 => 'sku',
                         1 => 'store_view_code', 
                         2 => 'attribute_set_code', 
                         3 => 'product_type', 
                         4 => 'categories',
                         5 => 'product_websites',
                         6 => 'name',
                         7 => 'description',
                         8 => 'short_description',
                         9 => 'weight',
                         10 => 'product_online',
                         11 => 'tax_class_name',
                         12 => 'visibility',
                         13 => 'price',
                         14 => 'special_price',
                         15 => 'special_price_from_date',
                         16 => 'special_price_to_date',
                         17 => 'url_key',
                         18 => 'meta_title',
                         19 => 'meta_keywords',
                         20 => 'meta_description',
                         21 => 'base_image',
                         22 => 'base_image_label',
                         23 => 'small_image',
                         24 => 'small_image_label',                         
                         25 => 'thumbnail_image',
                         26 => 'thumbnail_image_label',
                         27 => 'swatch_image',
                         28 => 'swatch_image_label',
                         29 => 'created_at',
                         30 => 'updated_at',
                         31 => 'new_from_date',
                         32 => 'new_to_date',
                         33 => 'display_product_options_in',
                         34 => 'map_price',
                         35 => 'msrp_price',
                         36 => 'map_enabled',
                         37 => 'gift_message_available',
                         38 => 'custom_design',
                         39 => 'custom_design_from',
                         40 => 'custom_design_to',
                         41 => 'custom_layout_update',
                         42 => 'page_layout',
                         43 => 'product_options_container',
                         44 => 'msrp_display_actual_price_type',
                         45 => 'country_of_manufacture',
                         46 => 'additional_attributes',
                         47 => 'qty',
                         48 => 'out_of_stock_qty',
                         49 => 'user_config_min_qty',
                         50 => 'is_qty_decimal',
                         51 => 'allow_backorders',
                         52 => 'use_config_backorders',
                         53 => 'min_cart_qty',
                         54 => 'use_config_min_sale_qty',
                         55 => 'max_cart_qty',
                         56 => 'use_config_max_sale_qty',
                         57 => 'is_in_stock',
                         58 => 'notify_on_stock_below',
                         59 => 'use_config_notify_stock_qty',
                         60 => 'manage_stock',
                         61 => 'use_config_manage_stock',
                         62 => 'use_config_qty_increments',
                         63 => 'qty_increments',
                         64 => 'use_config_enable_qty_inc',
                         65 => 'enable_qty_increments',
                         66 => 'is_decimal_divided',
                         67 => 'website_id',
                         68 => 'related_skus',
                         69 => 'related_position',
                         70 => 'crosssell_skus',
                         71 => 'crosssell_position',
                         72 => 'upsell_skus',
                         73 => 'upsell_position',
                         74 => 'additional_images',
                         75 => 'additional_image_labels',
                         76 => 'hide_from_product_page',
                         77 => 'bundle_price_type',
                         78 => 'bundle_sku_type',
                         79 => 'bundle_price_view',
                         80 => 'bundle_weight_type',
                         81 => 'bundle_values',
                         82 => 'bundle_shipment_type',
                         83 => 'associated_skus',
                         );

        $finalHeader = addAdditionalAttributes($finalHeader);

        return $finalHeader;

    }

    /* 
        
    Create magento 2 additional Attributes

    */
    function addAdditionalAttributes($finalHeader){

        // Additional Products Attributes defined by Client
        $additionalArray = array();

        //add them to header
        $arrayMerge = array_merge($finalHeader,$additionalArray);

        return $arrayMerge;

    }    

    /*
        Attach your csv info to array
    */
    function formatRowForMagento($row){

        //Replace this with own values depending of scv
            $arrayRow = array(0 => '', // sku
                         1 => '', // store_view_code
                         2 => '', // attribute_set_code
                         3 => '', // product_type
                         4 => '', // categories
                         5 => '', // product_websites
                         6 => '', // name
                         7 => '', // description
                         8 => '', // short_description
                         9 => '', // weight
                         10 => '', // product_online
                         11 => '', // tax_class_visibility
                         12 => '', // visibility
                         13 => '', // price
                         14 => '', // special_price
                         15 => '', // special_price_from_date
                         16 => '', // special_price_to_date
                         17 => '', // url_key
                         18 => '', // meta_title
                         19 => '', // meta_keywords
                         20 => '', // meta_description
                         21 => '', // base_image
                         22 => '', // base_image_label
                         23 => '', // small_image
                         24 => '', // small_image_label
                         25 => '', // thumbnail_image
                         26 => '', // thumbnail_image_label
                         27 => '', // swatch_image
                         28 => '', // swatch_image_label
                         29 => '', //created_at
                         30 => '', // updated_at
                         31 => '', // new_from_date
                         32 => '', // new_to_date
                         33 => '', // display_product_options_in
                         34 => '', // map_price
                         35 => '', // msrp_price
                         36 => '', // map_enable
                         37 => '', // gift_message_available
                         38 => '', // custom_design
                         39 => '', // custom_design_from
                         40 => '', // custom_design_to
                         41 => '', // custom_layout_update
                         42 => '', // page_laout
                         43 => '', //product_options_container
                         44 => '', // msrp_display_actual_price_type
                         45 => '', // country_of_manufacture
                         46 => '', // additional_attributes
                         47 => '', // qty
                         48 => '', // out_of_stock_qty
                         49 => '', //use_config_min_qty
                         50 => '', // is_qty_decimal
                         51 => '', // allow_backorders
                         52 => '', // use_config_backorders
                         53 => '', // min_cart_qty
                         54 => '', // use_config_min_sale_qty
                         55 => '', // max_cart_qty
                         56 => '', // use_config_max_sale_qty
                         57 => '', // is_in_stock
                         58 => '', // notify_on_stock_below
                         59 => '', // use_config_notify_stock_qty
                         60 => '', // manage_stock
                         61 => '', // use_config_manage_stock
                         62 => '', // use_config_qty_increments
                         63 => '', // qty_increments
                         64 => '', // use_config_enable_qty_inc
                         65 => '', // enable_qty_increments
                         66 => '', // is_decimal_divided
                         67 => '', // website_id
                         68 => '', // related_skus
                         69 => '', // related_position
                         70 => '', // crosssell_skus
                         71 => '', // crosssell_position
                         72 => '', // upsell_skus
                         73 => '', // upsell_position
                         74 => '', // additional_images
                         75 => '', // additional_image_labels
                         76 => '', // hide_from_product_page
                         77 => '', // bundle_price_type
                         78 => '', // bundle_sku_type
                         79 => '', // bundle_sku_type
                         80 => '', // bundle_weight_type
                         81 => '', // bundle_values
                         82 => '', // bundle_shipment_type
                         83 => '', // associated_skus                  
                        );
        return $arrayRow;
    }

?>