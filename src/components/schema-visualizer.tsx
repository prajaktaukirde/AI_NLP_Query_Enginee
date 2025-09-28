import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Link, Key, Type, Columns } from 'lucide-react';
import { Badge } from "./ui/badge";
import type { DiscoveredSchema } from "@/lib/data";

interface SchemaVisualizerProps {
  schema: DiscoveredSchema;
}

export default function SchemaVisualizer({ schema }: SchemaVisualizerProps) {
  return (
    <Card className="bg-secondary/50">
      <CardHeader>
        <CardTitle className="text-lg">Discovered Schema</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {schema.tables.map((table) => (
            <AccordionItem value={table.name} key={table.name}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-primary"/>
                  <span className="font-semibold">{table.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Columns className="w-4 h-4 text-muted-foreground" />
                      Columns
                    </h4>
                    <ul className="space-y-1 list-disc list-inside">
                      {table.columns.map((col) => (
                        <li key={col.name} className="flex items-center gap-2 ml-4">
                           <span className="font-mono text-sm">{col.name}</span>
                           <Badge variant="outline">{col.type}</Badge>
                           {col.isPrimaryKey && <Badge variant="secondary"><Key className="w-3 h-3 mr-1 inline"/>PK</Badge>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {schema.relationships.filter(r => r.fromTable === table.name).length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Link className="w-4 h-4 text-muted-foreground" />
                        Relationships
                      </h4>
                      <ul className="space-y-1">
                        {schema.relationships.filter(r => r.fromTable === table.name).map((rel, index) => (
                           <li key={index} className="flex items-center gap-2 ml-4 font-mono text-sm">
                            <span>{rel.fromColumn}</span>
                            <span className="text-muted-foreground">-&gt;</span>
                            <span>{rel.toTable}.{rel.toColumn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
