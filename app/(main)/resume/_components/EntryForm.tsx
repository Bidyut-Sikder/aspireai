import { Button } from "@/components/ui/button";
import { entrySchema, resumeSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Sparkles, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parse } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";

interface EntryFormProps {
  type: string;
  entries: any; // Replace 'any' with the appropriate type if known
  onChange: (entries: any[]) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ type, entries, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false, //
    },
  });
  const {
    loading: isImproving,
    fn: inproveWithAIFn,
    data: improvedContent,
    error: errorOnImprove,
  } = useFetch(improveWithAI);

  const formatedDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  };

  const handleAdd = handleSubmit((data: any) => {
    const formattedEntry = {
      ...data,
      startDate: formatedDisplayDate(data.startDate),
      endDate: data.current ? "" : formatedDisplayDate(data.endDate),
    };
    onChange([...entries, formattedEntry]);
    // reset();
    setIsAdding(false);
  });
  const handeDelete = (index: number) => {
    const newEntries = entries.filter((_: any, i: number) => i !== index);
    onChange(newEntries);
    reset()
    // setIsAdding(false);
  };
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description to improve!");
      return;
    }

    await inproveWithAIFn({
      promptText: description,
      type: type.toLowerCase(),
    });
  };

  const current = watch("current");
  useEffect(() => {
    if (improvedContent) {
      setValue("description", improvedContent);
    }
  }, [improvedContent, isImproving, errorOnImprove]);
  return (
    <div>
      <div className="space-y-4">
        {entries.map((item: any, i: number) => {
          return (
            <Card className="mb-3" key={i}>
              <CardHeader className="flex flex-row items-center  justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title} @ {item.organization}
                </CardTitle>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  type="button"
                  onClick={() => handeDelete(i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.current
                    ? `${item.startDate} - Present`
                    : `${item.startDate} - ${item.startDate} `}
                </p>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* titlte */}
              <div className="space-y-2 ">
                <Label className="text-sm font-medium" htmlFor="email">
                  Title
                </Label>
                <Input
                  {...register("title")}
                  type="text"
                  placeholder="Title/Status"
                />
                {errors.title && (
                  <p className="text-red-500">{errors.title.message}</p>
                )}
              </div>{" "}
              <div className="space-y-2 ">
                <Label className="text-sm font-medium" htmlFor="organization">
                  Organization
                </Label>
                <Input
                  {...register("organization")}
                  type="text"
                  placeholder="your organization"
                />
                {errors.organization && (
                  <p className="text-red-500">{errors.organization.message}</p>
                )}
              </div>{" "}
            </div>
            {/* //////////// dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 ">
                <Input {...register("startDate")} type="month" />
                {errors.startDate && (
                  <p className="text-red-500">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2 ">
                <Input
                  {...register("endDate")}
                  disabled={current}
                  type="month"
                />
                {errors.endDate && (
                  <p className="text-red-500">{errors.endDate.message}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 ">
              <input
                {...register("current")}
                id="current"
                type="checkbox"
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <Label htmlFor="current">Current {type}</Label>
            </div>
            {/* description */}
            <div className="space-y-2 ">
              <Label className="text-sm font-medium" htmlFor="organization">
                Description
              </Label>
              <Textarea
                {...register("description")}
                className="h-32 resize-none"
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>{" "}
            <Button
              type="button"
              variant={"ghost"}
              size={"sm"}
              disabled={isImproving || !watch("description")}
              onClick={handleImproveDescription}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-0 animate-spin" />
                  Improving..
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-0 " />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" variant={"outline"} onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-0" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}
      {!isAdding && (
        <Button className="w-full" onClick={() => setIsAdding(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add {type}
        </Button>
      )}
    </div>
  );
};

export default EntryForm;
