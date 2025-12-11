import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DynamicTable from "../table/DynamicTable";
import PageTitle from "../shared-ui/PageTitle";

const RolesStatusesTable = ({ title, onAdd, placeholder, columns, data }) => {
    const [input, setInput] = useState("");

    return (
        <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3">{title}</h2>


            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (input.trim()) onAdd(input);
                    setInput("");
                }}
                className="flex gap-2 mb-4 mt-4"
            >
                <Input
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" disabled={!input.trim()} >
                    Add
                </Button>
            </form>

            <DynamicTable columns={columns} data={data} total={data.length || 0} onPageChange={() => { }} perPage={10} page={1} />

        </div>
    );
};

export default RolesStatusesTable;
