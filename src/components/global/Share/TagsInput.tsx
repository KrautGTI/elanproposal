import { FC, ReactEventHandler } from "react";

interface TagsInputProps {
  id: string;
  name: string;
  defaultTags?: string[];
  onAddTag: (value: string) => void;
  onDeleteTag: (value: string) => void;
  validateTag?: (value: string) => boolean;
  placeholder?: string;
}

const TagsInput: FC<TagsInputProps> = ({
  id,
  name,
  defaultTags = [],
  onAddTag,
  onDeleteTag,
  placeholder,
  validateTag,
}) => {
  const isTagValid = (tag: string) => !validateTag || validateTag(tag);

  const handleBlur = e => {
    let input = e.target.value.trim();
    // return if empty tags
    if (input.length === 0) return;

    if (isTagValid(input)) {
      onAddTag(input);
      e.target.value = "";
    }
  };

  const handleKeyup = e => {
    if (e.key === "," || e.key === "Enter") {
      let input = e.target.value.trim().split(",");
      // return if empty tags
      if (input.length === 0) return;

      for (let item of input) {
        let tag = item.trim();

        if (isTagValid(tag)) {
          onAddTag(tag);
        }
      }

      e.target.value = "";
    }
  };

  return (
    <div className="mt-1 relative rounded-md shadow-sm">
      <TagList tags={defaultTags} onDeleteTag={onDeleteTag} />
      <input
        id={id}
        className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
        type="text"
        name={name}
        spellCheck="false"
        autoComplete="false"
        autoCapitalize="off"
        autoCorrect="off"
        dir="ltr"
        onBlur={handleBlur}
        onKeyUp={handleKeyup}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TagsInput;

function TagList({ tags, onDeleteTag }: { tags: string[]; onDeleteTag: TagsInputProps["onDeleteTag"] }) {
  if (!tags.length) return null;

  return (
    <div className="tag-list pl-3 py-3 flex items-center">
      {tags.map(tag => {
        return <Tag onDelete={() => onDeleteTag(tag)} key={tag} value={tag} />;
      })}
    </div>
  );
}

function Tag({ onDelete, value }: { onDelete: ReactEventHandler; value: string }) {
  return (
    <span className="tag inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
      {value}
      <button
        type="button"
        className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none focus:bg-gray-500 focus:text-white"
        onClick={onDelete}
      >
        <span className="sr-only">Remove {value}</span>
        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  );
}
