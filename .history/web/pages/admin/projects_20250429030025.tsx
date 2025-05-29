import { useState } from 'react';
import Layout from '../../components/Layout';
import { withAuth } from '../../components/withAuth';
import useSWR from 'swr';
import axios from 'axios';
import Modal from '../../components/Modal';
import dynamic from 'next/dynamic';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import axiosInstance from '../../lib/axiosInstance';


const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const ProjectPreview = dynamic(() => import('../../components/ProjectPreview'), { ssr: false });


interface ContentBlockForm {
  id?: string;
  type: string;
  layout?: 'left' | 'right';
  src?: string;
  alt?: string;
  text?: string;
  data?: any;
}

interface ProjectForm {
  id?: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  category: string;
  thumbnail?: string;
  blocks: ContentBlockForm[];
  team: { name: string; role: string }[];
}

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const AdminProjects: React.FC = () => {
  const { data: projects, mutate } = useSWR<ProjectForm[]>(`${API}/projects`, fetcher);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProjectForm>({
    title: '', slug: '', type: '', description: '', category: '', thumbnail: '', blocks: [], team: []
  });
  const [previewData, setPreviewData] = useState<ProjectForm | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [blockUploadProgress, setBlockUploadProgress] = useState<{ [idx: number]: number }>({});

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(formData.blocks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setFormData({ ...formData, blocks: reordered });
  };

  const openForm = (project?: ProjectForm) => {
    if (project) {
      setFormData({
        id: project.id,
        title: project.title || '',
        slug: project.slug || '',
        type: project.type || '',
        description: project.description || '',
        category: project.category || '',
        thumbnail: project.thumbnail || '',
        blocks: project.blocks || [],
        team: project.team || [],
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        type: '',
        description: '',
        category: '',
        thumbnail: '',
        blocks: [],
        team: [],
      });
    }
    setShowForm(true);
  };
  

// Clean and fixed saveProject() function

const saveProject = async () => {
  try {
    // Clean blocks and team before saving
    const cleanedBlocks = formData.blocks.map((block) => {
      const { id, ...rest } = block;
      return rest;
    });
    const cleanedTeam = formData.team.map((member) => {
      const { id, ...rest } = member;
      return rest;
    });

    // Clean payload to send
    const { id, ...restFormData } = formData;

    const payload = {
      ...restFormData,
      blocks: cleanedBlocks,
      team: cleanedTeam,
    };

    if (formData.id) {
      await axios.put(`${API}/projects/${formData.id}`, payload);
    } else {
      await axios.post(`${API}/projects`, payload);
    }

    mutate();
    setShowForm(false);
  } catch (error: any) {
    console.error('Save project failed:', error.response?.data || error.message);
    alert('Save failed: ' + (error.response?.data?.message || error.message));
  }
};

  const deleteProject = async (id: string) => {
    console.log('Trying to delete ID:', id); // Add this line
  
    try {
      await axiosInstance.delete(`/projects/${id}`);
      mutate();
    } catch (error: any) {
      console.error('Delete project failed:', error.response?.data || error.message);
      alert(`Delete failed: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const addBlock = () => {
    setFormData(prev => ({ ...prev, blocks: [...prev.blocks, { type: 'text', layout: 'left', text: '' }] }));
  };
  const updateBlock = (idx: number, block: ContentBlockForm) => {
    const blocks = [...formData.blocks];
    blocks[idx] = block;
    setFormData({ ...formData, blocks });
  };
  const removeBlock = (idx: number) => {
    setFormData({ ...formData, blocks: formData.blocks.filter((_, i) => i !== idx) });
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
  
    try {
      const res = await axios.post('/api/upload', fd, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
        }
      });
      setFormData(prev => ({ ...prev, thumbnail: res.data.url }));
      setUploadProgress(0); // Reset after success
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
      alert('Thumbnail upload failed.');
      setUploadProgress(0);
    }
  };
  

  const changeBlockType = (idx: number, type: string) => {
    const blocks = [...formData.blocks];
    switch (type) {
      case 'text':
        blocks[idx] = { type: 'text', text: '', layout: 'left' };
        break;
      case 'full_image':
        blocks[idx] = { type: 'full_image', src: '', alt: '' };
        break;
      case 'side_by_side_image':
        blocks[idx] = { type: 'side_by_side_image', data: { images: [] } };
        break;
      case 'text_and_side_image':
        blocks[idx] = { type: 'text_and_side_image', data: { text: '', image: { src: '', alt: '', layout: 'left' } } };
        break;
      case 'three_grid_layout':
        blocks[idx] = { type: 'three_grid_layout', data: { items: [] } };
        break;
    }
    setFormData({ ...formData, blocks });
  };
  
  const moveBlockUp = (idx: number) => {
    if (idx === 0) return;
    const blocks = [...formData.blocks];
    [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
    setFormData({ ...formData, blocks });
  };
  
  const moveBlockDown = (idx: number) => {
    if (idx === formData.blocks.length - 1) return;
    const blocks = [...formData.blocks];
    [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
    setFormData({ ...formData, blocks });
  };

  const renderBlockFields = (idx: number, block: ContentBlockForm) => {
    switch (block.type) {
      case 'text':
        return (
          <>
            <select
              value={block.layout || 'left'}
              onChange={e => updateBlock(idx, { ...block, layout: e.target.value as 'left' | 'right' })}
              className="input w-full mb-2"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
            <textarea
              value={block.text || ''}
              onChange={e => updateBlock(idx, { ...block, text: e.target.value })}
              className="input w-full"
              placeholder="Enter text"
            />
          </>
        );
  
      case 'full_image':
        return (
          <>
            {block.src && <img src={block.src} className="w-full h-auto mb-2" />}
            <input type="file" onChange={e => handleBlockImageUpload(idx, e)} />
            <input
              type="text"
              placeholder="Alt text"
              value={block.alt || ''}
              onChange={e => updateBlock(idx, { ...block, alt: e.target.value })}
              className="input w-full mt-2"
            />
          </>
        );
  
      case 'side_by_side_image':
        return (
          <>
            {(block.data?.images || []).map((img: { src: string; layout: 'left' | 'right'; alt?: string }, imgIdx: number) => (
              <div key={imgIdx} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={img.src}
                  onChange={e => {
                                        const updated = (block.data?.images || []).filter((_: any, i: number) => i !== imgIdx)

                    updated[imgIdx].src = e.target.value;
                    updateBlock(idx, { ...block, data: { images: updated } });
                  }}
                  className="input flex-1"
                />
                <select
                  value={img.layout}
                  onChange={e => {
                    const updated = [...(block.data?.images || [])];
                    updated[imgIdx].layout = e.target.value as 'left' | 'right';
                    updateBlock(idx, { ...block, data: { images: updated } });
                  }}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
                <button
                  className="btn-sm btn-red"
                  onClick={() => {
                    const updated = (block.data?.images || []).filter((_: any, i: number) => i !== imgIdx);
                    updateBlock(idx, { ...block, data: { images: updated } });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => updateBlock(idx, {
                ...block,
                data: { images: [...(block.data?.images || []), { src: '', layout: 'left' }] }
              })}
              className="btn-sm"
            >
              + Add Image
            </button>
          </>
        );
  
      case 'text_and_side_image':
        return (
          <>
            <textarea
              placeholder="Text content"
              value={block.data?.text || ''}
              onChange={e => updateBlock(idx, {
                ...block,
                data: { ...block.data, text: e.target.value }
              })}
              className="input w-full mb-2"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={block.data?.image?.src || ''}
              onChange={e => updateBlock(idx, {
                ...block,
                data: { ...block.data, image: { ...(block.data?.image || {}), src: e.target.value } }
              })}
              className="input w-full"
            />
            <select
              value={block.data?.image?.layout || 'left'}
              onChange={e => updateBlock(idx, {
                ...block,
                data: { ...block.data, image: { ...(block.data?.image || {}), layout: e.target.value as 'left' | 'right' } }
              })}
              className="input w-full mt-2"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </>
        );
  
        case 'three_grid_layout':
          return (
            <>
              {(block.data?.items || []).map((item: { type: 'text' | 'image'; text?: string; src?: string }, itemIdx: number) => (
                <div key={itemIdx} className="flex items-center space-x-2 mb-2">
                  <select
                    value={item.type}
                    onChange={e => {
                      const updated = [...(block.data?.items || [])];
                      updated[itemIdx].type = e.target.value as 'text' | 'image';
                      updateBlock(idx, { ...block, data: { items: updated } });
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                  </select>
  
                  {item.type === 'text' ? (
                    <input
                      type="text"
                      placeholder="Text"
                      value={item.text || ''}
                      onChange={e => {
                        const updated = [...(block.data?.items || [])];
                        updated[itemIdx].text = e.target.value;
                        updateBlock(idx, { ...block, data: { items: updated } });
                      }}
                      className="input flex-1"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={item.src || ''}
                      onChange={e => {
                        const updated = [...(block.data?.items || [])];
                        updated[itemIdx].src = e.target.value;
                        updateBlock(idx, { ...block, data: { items: updated } });
                      }}
                      className="input flex-1"
                    />
                  )}
                  <button
                    className="btn-sm btn-red"
                    onClick={() => {
                      const updated = (block.data?.items || []).filter((_: any, i: number) => i !== itemIdx);
                      updateBlock(idx, { ...block, data: { items: updated } });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateBlock(idx, {
                  ...block,
                  data: { items: [...(block.data?.items || []), { type: 'text', text: '', layout: 'left' }] }
                })}
                className="btn-sm"
              >
                + Add Item
              </button>
            </>
          );
  
      default:
        return <div>Unknown block type</div>;
    }
  };
  
  

  const handleBlockImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
  
    try {
      const res = await axios.post('/api/upload', fd, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setBlockUploadProgress(prev => ({ ...prev, [idx]: percent }));
        }
      });
      updateBlock(idx, { ...formData.blocks[idx], src: res.data.url });
      setBlockUploadProgress(prev => ({ ...prev, [idx]: 0 }));
    } catch (err) {
      console.error('Block image upload failed:', err);
      alert('Block image upload failed.');
      setBlockUploadProgress(prev => ({ ...prev, [idx]: 0 }));
    }
  };
  

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Manage Projects</h1>
      <button onClick={() => openForm()} className="mb-4 btn-blue">+ New Project</button>

      <table className="w-full table-auto mb-8">
        <thead><tr className="bg-gray-200"><th className="p-2 border">Title</th><th className="p-2 border">Slug</th><th className="p-2 border">Category</th><th className="p-2 border">Thumbnail</th><th className="p-2 border">Actions</th></tr></thead>
        <tbody>
          {projects?.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-2 border">{p.title}</td>
              <td className="p-2 border">{p.slug}</td>
              <td className="p-2 border">{p.category}</td>
              <td className="p-2 border">{p.thumbnail && <img src={p.thumbnail} className="h-12 w-12 object-cover" />}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => openForm(p)} className="btn-sm">Edit</button>
                <button onClick={() => deleteProject(p.id!)} className="btn-sm btn-red">Delete</button>
                <button onClick={() => setPreviewData(p)} className="btn-sm btn-gray">Preview</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
  <Modal onClose={() => setShowForm(false)} title={formData.id ? 'Edit Project' : 'New Project'}>
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
        className="input w-full"
      />

      {/* Slug */}
      <input
        type="text"
        placeholder="Slug"
        value={formData.slug}
        onChange={e => setFormData({ ...formData, slug: e.target.value })}
        className="input w-full"
      />

      {/* Type */}
      <input
        type="text"
        placeholder="Type"
        value={formData.type}
        onChange={e => setFormData({ ...formData, type: e.target.value })}
        className="input w-full"
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={e => setFormData({ ...formData, description: e.target.value })}
        className="input w-full h-24"
      />

      {/* Category */}
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={e => setFormData({ ...formData, category: e.target.value })}
        className="input w-full"
      />

      {/* Thumbnail upload */}
      <div>
        <label className="block mb-2 font-semibold">Thumbnail</label>
        {formData.thumbnail && <img src={formData.thumbnail} className="h-16 w-16 object-cover mb-2" />}
        <input type="file" onChange={handleThumbnailUpload} />
        {uploadProgress > 0 && (
  <div className="w-full bg-gray-200 rounded mt-2">
    <div
      className="bg-blue-500 text-xs font-bold text-center text-white rounded"
      style={{ width: `${uploadProgress}%` }}
    >
      {uploadProgress}%
    </div>
  </div>
)}

      </div>

      {/* Team members */}
      <div>
        <label className="block mb-2 font-semibold">Team</label>
        {formData.team.map((member, idx) => (
          <div key={idx} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={e => {
                const team = [...formData.team];
                team[idx].name = e.target.value;
                setFormData({ ...formData, team });
              }}
              className="input flex-1"
            />
            <input
              type="text"
              placeholder="Role"
              value={member.role}
              onChange={e => {
                const team = [...formData.team];
                team[idx].role = e.target.value;
                setFormData({ ...formData, team });
              }}
              className="input flex-1"
            />
            <button onClick={() => setFormData(prev => ({
              ...prev,
              team: prev.team.filter((_, i) => i !== idx)
            }))} className="btn-sm btn-red">Remove</button>
          </div>
        ))}
        <button onClick={() => setFormData(prev => ({
          ...prev,
          team: [...prev.team, { name: '', role: '' }]
        }))} className="btn-sm">+ Add Team Member</button>
      </div>

             {/* Content Blocks */}
             <div>
              <label className="block mb-2 font-semibold">Content Blocks</label>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {formData.blocks.map((block, idx) => (
                        <Draggable draggableId={String(idx)} index={idx} key={idx}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="block-editor p-4 mb-4 border rounded bg-gray-100"
                            >
                              <div {...provided.dragHandleProps} className="cursor-move text-gray-400 hover:text-black mb-2">
                                🟰 Drag
                              </div>
                              <select value={block.type} onChange={e => changeBlockType(idx, e.target.value)} className="input w-full mb-2">
                                <option value="text">Text</option>
                                <option value="full_image">Full Image</option>
                                <option value="side_by_side_image">Side-by-Side Image</option>
                                <option value="text_and_side_image">Text + Side Image</option>
                                <option value="three_grid_layout">Three Grid Layout</option>
                              </select>

                              {blockUploadProgress[idx] > 0 && (
                                <div className="w-full bg-gray-200 rounded mt-2">
                                  <div
                                    className="bg-green-500 text-xs font-bold text-center text-white rounded"
                                    style={{ width: `${blockUploadProgress[idx]}%` }}
                                  >
                                    {blockUploadProgress[idx]}%
                                  </div>
                                </div>
                              )}

                              {renderBlockFields(idx, block)}

                              <button onClick={() => removeBlock(idx)} className="btn-sm btn-red mt-2">🗑 Remove</button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <button onClick={addBlock} className="btn-sm mt-2">+ Add Block</button>
            </div>

            <button onClick={saveProject} className="btn-blue w-full mt-4">
              Save Project
            </button>
            <button onClick={() => setShowForm(false)} className="btn-red w-full mt-2">
              Cancel
            </button>
          </div>
        </Modal>
      )}


      {previewData && (
        <Modal onClose={() => setPreviewData(null)} title="Preview Project">
          <ProjectPreview data={previewData} />
        </Modal>
      )}
    </Layout>
  );
};

export default withAuth(AdminProjects);
