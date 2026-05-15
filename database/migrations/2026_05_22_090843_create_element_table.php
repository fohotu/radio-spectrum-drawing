<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    
    /*
  const [frGroups,setFrGroups] = useState([
      {
          id: Date.now().toString(),
          fr_begin: 0,
          fr_end: 0,
          scale: 0.5,
          elements: [
              {
                  id: (Date.now() + Math.random()).toString(),
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                  label: "Empty",
                  label_left_position: 40,
                  label_top_position: 40,
                  bold: false,
                  italic: false,
                  bgColor: "#0081fa",
                  textColor: "#000000",
                  fontSize: 14,
                  rotate: 0,
                  fr_begin: 40,
                  fr_end: 50,
                  fr_text_rotate: 0,
                  fr_text_top: 0,
                  fr_text_left: 0,
                  fr_text_size: 14,
                  fr_text_color: "#000000",
                  fr_text_position: "top",
                  type: "Title",
                  borderBox: 1,
                  borderBoxColor: "#000000",
                  visible_begin: true,
                  visible_end: true,
                  fr_distinction: true,
                  measure: "kHz",
              },
          ],
      },
  ]);
*/

    public function up(): void
    {
       
        Schema::create('elements', function (Blueprint $table) {
            
            $table->id();
            $table->foreignId('group_id')
                ->constrained('groups')
                ->onDelete('cascade');
            $table->integer('x')->default(0);
            $table->integer('y')->default(0);
            $table->integer('width')->default(100);
            $table->integer('height')->default(100);
            $table->string('label')->default('Empty')->nullable();

            $table->string('description')->nullable();

            $table->integer('label_left_position')->default(0);
            $table->integer('label_top_position')->default(0);
            $table->boolean('bold')->default(false);
            $table->boolean('italic')->default(false);
            $table->string('bgColor')->default('#0081fa');
            $table->string('textColor')->default('#000000');
            $table->integer('fontSize')->default(14);
            $table->integer('rotate')->default(0);
            $table->integer('fr_begin')->default(0);
            $table->integer('fr_end')->default(0);
            $table->integer('fr_text_rotate')->default(0);
            $table->integer('fr_text_top')->default(0);
            $table->integer('fr_text_left')->default(0);
            $table->integer('fr_text_size')->default(14);
            $table->string('fr_text_color')->default('#000000');
            $table->string('fr_text_position')->default('top');
            $table->string('type')->default('title');
            $table->integer('borderBox')->default(1);
            $table->string('borderBoxColor')->default('#000000');
            $table->boolean('visible_begin')->default(true);
            $table->boolean('visible_end')->default(true);
            $table->boolean('fr_distinction')->default(true);
            $table->string('measure')->default('khz');

            $table->boolean('visible_border_top')->default(true);
            $table->boolean('visible_border_right')->default(true);
            $table->boolean('visible_border_bottom')->default(true);
            $table->boolean('visible_border_left')->default(true);

            $table->integer('border_top_value')->default(1);
            $table->integer('border_right_value')->default(1);
            $table->integer('border_bottom_value')->default(1);
            $table->integer('border_left_value')->default(1);
            $table->string('borderColor')->default('#000000');

            $table->timestamps();

        });

}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('elements', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
        });

        Schema::dropIfExists('elements');
    }

    /*
    public function up(): void
    {
        Schema::create('elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')
                ->constrained()
                ->onDelete('cascade');
            $table->integer('x')->default(0);
            $table->integer('y')->default(0);
            $table->integer('width')->default(100);
            $table->integer('height')->default(100);
            $table->string('label')->default('Empty');
            $table->boolean('bold')->nullable();
            $table->boolean('italic')->nullable();
            $table->string('bgColor')->default('#c1c1c1');
            $table->string('textColor')->default('#000000');
            $table->integer('fontSize')->default(14);
            $table->integer('rotate')->default(0);
            $table->integer('fr_begin')->nullable();
            $table->integer('fr_end')->nullable();
            $table->integer('fr_text_rotate')->default(0);
            $table->integer('fr_text_top')->default(0);
            $table->integer('fr_text_left')->default(0);
            $table->integer('fr_text_size')->default(14);
            $table->string('fr_text_color')->default('#000000');
            $table->string('fr_text_position')->default('top');
            $table->string('type')->default('title');
            $table->boolean('borderBox')->default(1);
            $table->string('borderBoxColor')->default('#000000');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('elements');
    }
    */
};