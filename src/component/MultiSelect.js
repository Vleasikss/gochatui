import {Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack} from "@mui/material";
import {useState} from "react";
import Button from "@mui/material/Button";

/**
 *
 * @param { {data: [{key: {}, value: {}}]}, onSelect: () => void} props
 * @return {JSX.Element}
 * @constructor
 */
export default function MultiSelect(props) {

    return (
        <FormControl sx={{ m: 1, width: 500 }}>
            <InputLabel>Multiple Select</InputLabel>
            <Select
                multiple
                value={props.selected}
                onChange={(e) => props.onSelect(e.target.value)}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                    <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value, index) => (
                            <Chip key={index} label={value} />
                        ))}
                    </Stack>
                )}
            >
                {props.data.map((name) => (
                    <MenuItem key={name.key} value={name.value}>
                        {name.value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}