import {React, useState } from 'react';
import Button from '../components/ui/Button';

const Problems = () =>{
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "LeetCode", "Codeforces", "CodeChef"];

  return (
    <div className="flex gap-3">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}

export default Problems

