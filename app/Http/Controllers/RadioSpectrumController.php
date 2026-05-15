<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Document;
use App\Models\Group;
use App\Models\Element;
use Illuminate\Support\Facades\Auth;

class RadioSpectrumController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->search;
        $documents = auth()->user()
            ->documents()
             ->when($search, function ($query) use ($search) {
                $query->where('title', 'like', '%' . $search . '%');
            })
            ->with('groups.elements')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($document) {

                return [
                    'id' => $document->id,
                    'title' => $document->title,

                    'groups_count' => $document->groups->count(),

                    'elements_count' => $document->groups->sum(function ($group) {
                        return $group->elements->count();
                    }),

                    'created_at' => $document->created_at->format('d.m.Y H:i'),
                ];
            });

        return Inertia::render('Radiospectrum/Index', [
            'documents' => $documents,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }


    public function edit($id)
    {
        $document = Document::with([
                'groups.elements'
            ])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return Inertia::render('Radiospectrum/Edit', [
            'document' => $document,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Radiospectrum/Main',[]);
    }

    public function copy(Request $request)
    {
      //dd($request);
       $group = json_decode($request->group, true);
       $page = json_decode($request->page, true);
       return Inertia::render('Radiospectrum/Main',['defaultPage'=>$page,'defaultGroups'=>$group]);
    }


    public function destroy($id)
    {
        $document = Document::findOrFail($id);

        $document->delete();

        return redirect()->back();
    }

    public function store(Request $request)
    {

        
        $group = json_decode($request->group); 
        $document = json_decode($request->page);

    


        $document_model = new Document;
        $document_model->title = $document->title;
        $document_model->format = !empty($document->format) ? $document->format : "A4"; 
        $document_model->user_id = Auth::id();
        $document_model->orientation = !empty($document->orientation) ? $document->orientation:"portrait"; 
        $document_model->zoom = !empty($document->zoom) ? $document->zoom:1; 

       // dd($document_model);
        
        /*
        
         $table->string('title')->nullable();

            $table->string('format')->default('A4');

            $table->string('orientation')->default('portrait');

            $table->integer('zoom')->default(100);

        */

        if($document_model->save()){
                foreach($group as $item){
                
                    $group_model = new Group;
                    $group_model->fr_begin = $item->fr_begin;
                    $group_model->fr_end = $item->fr_end;
                    $group_model->scale = $item->scale;
                    $group_model->document_id = $document_model->id;
                    
                /*
                
                
                */

                    if($group_model->save()){
                        if(!empty($item->elements)){
                            foreach($item->elements as $element){

                              //  dump($element->x,!empty($element->x));

                                $element_model = new Element;
                                $element_model->group_id = $group_model->id;
                                $element_model->x =  !empty($element->x) ? $element->x : 0;
                                $element_model->y =  !empty($element->y) ? $element->y : 0;
                                $element_model->width =  !empty($element->width) ? $element->width : 100;
                                $element_model->height =  !empty($element->height) ? $element->height : 100;
                                $element_model->label =  !empty($element->label) ? $element->label : "";

                                $element_model->description =  !empty($element->description) ? $element->description: "";

                                $element_model->label_left_position =  !empty($element->label_left_position) ? $element->label_left_position: 0;
                                $element_model->label_top_position =  !empty($element->label_top_position) ? $element->label_top_position : 0;
                                $element_model->bold =  !empty($element->bold) ? $element->bold : 0;
                                $element_model->italic =  !empty($element->italic) ? $element->italic: 0;
                                $element_model->bgColor =  !empty($element->bgColor) ? $element->bgColor: '#0081fa';
                                $element_model->textColor =  !empty($element->textColor) ? $element->textColor : '#000000';
                                $element_model->fontSize =  !empty($element->fontSize) ? $element->fontSize: 14;
                                $element_model->rotate =  !empty($element->rotate) ? $element->rotate: 0;
                                $element_model->fr_begin =  !empty($element->fr_begin) ? $element->fr_begin: 0;
                                $element_model->fr_end =  !empty($element->fr_end) ? $element->fr_end: 0;
                                $element_model->fr_text_rotate =  !empty($element->fr_text_rotate) ? $element->fr_text_rotate : 0;
                                $element_model->fr_text_top =  !empty($element->fr_text_top) ? $element->fr_text_top: 0;
                                $element_model->fr_text_left =  !empty($element->fr_text_left) ? $element->fr_text_left: 0;
                                $element_model->fr_text_size =  !empty($element->fr_text_size) ? $element->fr_text_size: 0;
                                $element_model->fr_text_color =  !empty($element->fr_text_color) ? $element->fr_text_color: 0;
                                $element_model->fr_text_position =  !empty($element->fr_text_position) ? $element->fr_text_position : 0;
                                $element_model->type =  !empty($element->type) ? $element->type: 0;
                                $element_model->borderBox =  !empty($element->borderBox) ? $element->borderBox : 0;
                                $element_model->borderBoxColor =  !empty($element->borderBoxColor) ? $element->borderBoxColor: 0;
                                $element_model->visible_begin =  !empty($element->visible_begin) ? $element->visible_begin: 0;
                                $element_model->visible_end =  !empty($element->visible_end) ? $element->visible_end: 0;
                                $element_model->fr_distinction =  !empty($element->fr_distinction) ? $element->fr_distinction: 0;
                                $element_model->measure =  !empty($element->measure) ? $element->measure : "khz";

                                $element_model->visible_border_top = isset($element->visible_border_top) ? $element->visible_border_top : false;
                                $element_model->visible_border_right = isset($element->visible_border_right) ? $element->visible_border_right:false;
                                $element_model->visible_border_bottom = isset($element->visible_border_bottom) ? $element->visible_border_bottom: false;
                                $element_model->visible_border_left = isset($element->visible_border_left) ? $element->visible_border_left : false;
                                
                                
                                $element_model->border_top_value = !empty($element->border_top_value) ? $element->border_top_value : 1;
                                $element_model->border_right_value = !empty($element->border_right_value) ? $element->border_right_value : 1;
                                $element_model->border_bottom_value = !empty($element->border_bottom_value) ? $element->border_bottom_value : 1;
                                $element_model->border_left_value = !empty($element->border_left_value) ? $element->border_left_value: 1;
                                $element_model->borderColor = !empty($element->borderColor) ? $element->borderColor : '#000000';

                                $element_model->save();    
                                
            
                            }
                        }
                    }
                }
        }

    

     // return redirect()->back()->with('success', 'Saved');
      //  return redirect()->route('radiospectrum.edit', $document_model->id);
         return response()->json([
            'success' => true,
            'document_id' => $document_model->id,
        ]);
    }


    public function update(Request $request, $id)
    {

        $groups = json_decode($request->group);
        $page = json_decode($request->page);
       // dd($groups,$page);

      
     
        $document = Document::where('user_id', Auth::id())
            ->findOrFail($id);
        
        

        // UPDATE DOCUMENT
        $document->title =
            !empty($page->title)
                ? $page->title
                : "";

        $document->format =
            !empty($page->format)
                ? $page->format
                : "A4";

        $document->orientation =
            !empty($page->orientation)
                ? $page->orientation
                : "portrait";

        $document->zoom =
            !empty($page->zoom)
                ? $page->zoom
                : 1;

        $document->save();

        // DELETE OLD GROUPS + ELEMENTS
        foreach ($document->groups as $oldGroup) {

            Element::where('group_id', $oldGroup->id)
                ->delete();
        }

        Group::where('document_id', $document->id)
            ->delete();

        // CREATE NEW GROUPS + ELEMENTS
        if (!empty($groups)) {

            foreach ($groups as $item) {

                $group_model = new Group;

                $group_model->fr_begin =
                    !empty($item->fr_begin)
                        ? $item->fr_begin
                        : 0;

                $group_model->fr_end =
                    !empty($item->fr_end)
                        ? $item->fr_end
                        : 0;

                $group_model->scale =
                    !empty($item->scale)
                        ? $item->scale
                        : 1;

                $group_model->document_id =
                    $document->id;

                if ($group_model->save()) {

                    if (!empty($item->elements)) {

                        foreach (
                            $item->elements
                            as $element
                        ) {

                            $element_model =
                                new Element;

                            $element_model->group_id =
                                $group_model->id;

                            $element_model->x =
                                !empty($element->x)
                                    ? $element->x
                                    : 0;

                            $element_model->y =
                                !empty($element->y)
                                    ? $element->y
                                    : 0;

                            $element_model->width =
                                !empty($element->width)
                                    ? $element->width
                                    : 100;

                            $element_model->height =
                                !empty($element->height)
                                    ? $element->height
                                    : 100;

                            $element_model->label =
                                !empty($element->label)
                                    ? $element->label
                                    : "";

                            $element_model->description =
                                !empty($element->description)
                                    ? $element->description
                                    : "";

                            $element_model->label_left_position =
                                !empty($element->label_left_position)
                                    ? $element->label_left_position
                                    : 0;

                            $element_model->label_top_position =
                                !empty($element->label_top_position)
                                    ? $element->label_top_position
                                    : 0;

                            $element_model->bold =
                                !empty($element->bold)
                                    ? $element->bold
                                    : 0;

                            $element_model->italic =
                                !empty($element->italic)
                                    ? $element->italic
                                    : 0;

                            $element_model->bgColor =
                                !empty($element->bgColor)
                                    ? $element->bgColor
                                    : '#0081fa';

                            $element_model->textColor =
                                !empty($element->textColor)
                                    ? $element->textColor
                                    : '#000000';

                            $element_model->fontSize =
                                !empty($element->fontSize)
                                    ? $element->fontSize
                                    : 14;

                            $element_model->rotate =
                                !empty($element->rotate)
                                    ? $element->rotate
                                    : 0;

                            $element_model->fr_begin =
                                !empty($element->fr_begin)
                                    ? $element->fr_begin
                                    : 0;

                            $element_model->fr_end =
                                !empty($element->fr_end)
                                    ? $element->fr_end
                                    : 0;

                            $element_model->fr_text_rotate =
                                !empty($element->fr_text_rotate)
                                    ? $element->fr_text_rotate
                                    : 0;

                            $element_model->fr_text_top =
                                !empty($element->fr_text_top)
                                    ? $element->fr_text_top
                                    : 0;

                            $element_model->fr_text_left =
                                !empty($element->fr_text_left)
                                    ? $element->fr_text_left
                                    : 0;

                            $element_model->fr_text_size =
                                !empty($element->fr_text_size)
                                    ? $element->fr_text_size
                                    : 0;

                            $element_model->fr_text_color =
                                !empty($element->fr_text_color)
                                    ? $element->fr_text_color
                                    : '#000000';

                            $element_model->fr_text_position =
                                !empty($element->fr_text_position)
                                    ? $element->fr_text_position
                                    : 'top';

                            $element_model->type =
                                !empty($element->type)
                                    ? $element->type
                                    : 'Title';

                            $element_model->borderBox =
                                !empty($element->borderBox)
                                    ? $element->borderBox
                                    : 0;

                            $element_model->borderBoxColor =
                                !empty($element->borderBoxColor)
                                    ? $element->borderBoxColor
                                    : '#000000';

                            $element_model->visible_begin =
                                !empty($element->visible_begin)
                                    ? $element->visible_begin
                                    : 0;

                            $element_model->visible_end =
                                !empty($element->visible_end)
                                    ? $element->visible_end
                                    : 0;

                            $element_model->fr_distinction =
                                !empty($element->fr_distinction)
                                    ? $element->fr_distinction
                                    : 0;

                            $element_model->measure =
                                !empty($element->measure)
                                    ? $element->measure
                                    : 'kHz';

                            $element_model->visible_border_top =
                                isset($element->visible_border_top)
                                    ? $element->visible_border_top
                                    : false;

                            $element_model->visible_border_right =
                                isset($element->visible_border_right)
                                    ? $element->visible_border_right
                                    : false;

                            $element_model->visible_border_bottom =
                                isset($element->visible_border_bottom)
                                    ? $element->visible_border_bottom
                                    : false;

                            $element_model->visible_border_left =
                                isset($element->visible_border_left)
                                    ? $element->visible_border_left
                                    : false;

                            $element_model->border_top_value =
                                !empty($element->border_top_value)
                                    ? $element->border_top_value
                                    : 1;

                            $element_model->border_right_value =
                                !empty($element->border_right_value)
                                    ? $element->border_right_value
                                    : 1;

                            $element_model->border_bottom_value =
                                !empty($element->border_bottom_value)
                                    ? $element->border_bottom_value
                                    : 1;

                            $element_model->border_left_value =
                                !empty($element->border_left_value)
                                    ? $element->border_left_value
                                    : 1;

                            $element_model->borderColor =
                                !empty($element->borderColor)
                                    ? $element->borderColor
                                    : '#000000';

                            $element_model->save();
                        }
                    }
                }
            }
        }

        /*
        return redirect()
            ->back()
            ->with('success', 'Updated');
        */
        return response()->json([
            'success' => true,
            'document_id' => $document->id,
        ]);
    }
}
